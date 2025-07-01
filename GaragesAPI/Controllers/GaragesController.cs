using AutoMapper;
using GaragesAPI.Data;
using GaragesAPI.Models.DTOs;
using GaragesAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting; // Para IWebHostEnvironment
using System.IO; // Para Path
using System.Threading.Tasks; // Para Task
using System; // Para DateTime (para nome de arquivo único)
using GaragesAPI.Helpers; // Importar o namespace da sua classe PagedList
using System.Text.Json; // Para serializar os metadados da paginação
using System.Linq; // Para usar OrderBy, OrderByDescending
using System.Collections.Generic; // Para IEnumerable

namespace GaragesAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GaragesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper; // IMapper injetado
        private readonly IWebHostEnvironment _webHostEnvironment;

        public GaragesController(ApplicationDbContext context, IMapper mapper, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _mapper = mapper;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GarageDto>>> GetGarages([FromQuery] GarageParametersDto garageParameters)
        {
            if (_context.Garages == null)
                return NotFound();

            // 1. Inicia a query
            var collection = _context.Garages.Include(g => g.Vehicles) as IQueryable<Garage>; // .Include(g => g.Vehicles) adicionado
            collection = collection.Include(g => g.Vehicles);

            // 2. Aplica filtros
            if (!string.IsNullOrWhiteSpace(garageParameters.SearchQuery))
            {
                var searchQuery = garageParameters.SearchQuery.Trim();
                collection = collection.Where(g =>
                    g.Name.Contains(searchQuery) ||
                    g.Location.Contains(searchQuery) ||
                    g.StateArea.Contains(searchQuery)); // Adiciona mais campos conforme necessário
            }

            if (!string.IsNullOrWhiteSpace(garageParameters.Type))
            {
                collection = collection.Where(g => g.Type == garageParameters.Type);
            }

            var orderBy = garageParameters.OrderBy;

            if (!string.IsNullOrWhiteSpace(orderBy))
            {
                collection = orderBy.ToLower() switch
                {
                    "nameasc" => collection.OrderBy(g => g.Name),
                    "namedesc" => collection.OrderByDescending(g => g.Name),
                    "capacityasc" => collection.OrderBy(g => g.Capacity),
                    "capacitydesc" => collection.OrderByDescending(g => g.Capacity),
                    "vehiclecountasc" => collection.OrderBy(g => g.Vehicles.Count),
                    "vehiclecountdesc" => collection.OrderByDescending(g => g.Vehicles.Count),
                    "availableslotsasc" => collection.OrderBy(g => g.Capacity - g.Vehicles.Count),
                    "availableslotsdesc" => collection.OrderByDescending(g => g.Capacity - g.Vehicles.Count),
                    _ => collection.OrderBy(g => g.Id),// Ordem padrão
                };
            } else
            {
                collection = collection.OrderBy(g => g.Id);
            }

            // 3. Incluir veículo para cálculo de contagem
            var garagesQuery = collection; // // mantém a ordenação aplicada via orderBy

            // 4. criar a lista paginada
            var pagedGarages = await PagedList<Garage>
                .CreateAsync(garagesQuery, garageParameters.PageNumber, garageParameters.PageSize);

            // 5. Mapear para DTOs
            var garageDtos = _mapper.Map<IEnumerable<GarageDto>>(pagedGarages);

            // 6. Calcular NumberOfVehicles (se não vier da inclusão)
            foreach (var garageDto in garageDtos)
            {
                var originalGarage = pagedGarages.FirstOrDefault(g => g.Id == garageDto.Id);
                if (originalGarage != null)
                {
                    await _context.Entry(originalGarage).Collection(g => g.Vehicles).LoadAsync();
                    garageDto.NumberOfVehicles = originalGarage.Vehicles?.Count ?? 0;
                }
            }

            // 7. Adiciona metadados de paginação ao cabeçalho da resposta
            var paginationMetadata = new
            {
                totalCount = pagedGarages.TotalCount,
                pageSize = pagedGarages.PageSize,
                currentPage = pagedGarages.CurrentPage,
                totalPages = pagedGarages.TotalPages,
                hasPrevious = pagedGarages.HasPrevious,
                hasNext = pagedGarages.HasNext
            };

            Response.Headers.Append("X-Pagination",
                JsonSerializer.Serialize(paginationMetadata, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }));

            return Ok(garageDtos);
        

            // Incluindo os veículos para calcular a contagem e para o DTO
            //var garages = await _context.Garages
            //    .Include(g => g.Vehicles)
            //    .ToListAsync();

            // Mapeia a lista de garagens (modelo de dominio) para GarageDto
            //return Ok(_mapper.Map<IEnumerable<GarageDto>>(garages));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GarageDto>> GetGarage(int id)
        {
            if (_context.Garages == null)
                return NotFound();

            var garage = await _context.Garages
                .Include(g => g.Vehicles)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (garage == null)
                return NotFound();

            return _mapper.Map<GarageDto>(garage);
        }

        [HttpPost]
        public async Task<ActionResult<GarageDto>> AddGarage([FromForm] GarageCreateUpdateDto garageCreateUpdateDto)
        {
            if (_context.Garages == null)
                return Problem("Entidade 'Garages' é nula.");

            // Mapeia o GarageCreateUpdateDto para a entidade Garage
            var garage = _mapper.Map<Garage>(garageCreateUpdateDto);

            if (garageCreateUpdateDto.ImageFile != null)
                garage.ImageUrl = await SaveImage(garageCreateUpdateDto.ImageFile);
            else garage.ImageUrl = null;

                _context.Garages.Add(garage);
            await _context.SaveChangesAsync();

            // Mapeia a entidade criada de volta para um DTO para retornar
            var createdGarageDto = _mapper.Map<GarageDto>(garage);

            return CreatedAtAction(nameof(GetGarage), new { id = garage.Id }, createdGarageDto);

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGarage(int id, [FromForm] GarageCreateUpdateDto garageCreateUpdateDto)
        {
            if (id != garageCreateUpdateDto.Id)
                return BadRequest("O ID da rota não corresponde ao ID no corpo da requisição.");

            // Busca a entidade existente do banco de dados
            var existingGarage = await _context.Garages
                .AsNoTracking()
                .FirstOrDefaultAsync(g => g.Id == id);

            if (existingGarage == null)
                return NotFound();

            var garageToUpdate = _mapper.Map<Garage>(garageCreateUpdateDto);
            garageCreateUpdateDto.Id = id;

            if (garageCreateUpdateDto.ImageFile != null)
            {
                if (!string.IsNullOrEmpty(existingGarage.ImageUrl))
                {
                    DeleteImage(existingGarage.ImageUrl);
                }
                garageToUpdate.ImageUrl = await SaveImage(garageCreateUpdateDto.ImageFile);
            }
            else
            {
                if (garageCreateUpdateDto.RemoveExistingImage)
                {
                    if (!string.IsNullOrEmpty(existingGarage.ImageUrl))
                    {
                        DeleteImage(existingGarage.ImageUrl);
                    }
                    garageToUpdate.ImageUrl = null;
                }
                else
                {
                    garageToUpdate.ImageUrl = existingGarage.ImageUrl;
                }
            }

            //garage.Type = garageUpdateDto.Type;
            //garage.Name = garageUpdateDto.Name;
            //garage.Location = garageUpdateDto.Location;
            //garage.StateArea = garageUpdateDto.StateArea;
            //garage.Capacity = garageUpdateDto.Capacity;

            // Mapeia os dados do DTO para a entidade existente
            _mapper.Map(garageCreateUpdateDto, existingGarage); // Atualiza a entidade 'garage' com os valores de 'garageDto'

            _context.Entry(garageToUpdate).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GarageExists(id))
                    return NotFound();

                else
                    throw;
            }

            return NoContent();

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGarage(int id)
        {
            if (_context.Garages == null)
                return NotFound();

            var garage = await _context.Garages.FindAsync(id);
            if (garage == null)
                return NotFound();

            if (!string.IsNullOrEmpty(garage.ImageUrl))
            {
                DeleteImage(garage.ImageUrl);
            }

            _context.Garages.Remove(garage);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GarageExists(int id)
        {
            return (_context.Garages?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        // Salva a imagem no wwwroot/images e retorna a URL relativa
        private async Task<string> SaveImage(IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
            {
                return null;
            }

            if (string.IsNullOrEmpty(_webHostEnvironment.WebRootPath))
            {
                Console.Error.WriteLine("ERRO GRAVE: _webHostEnvironment.WebRootPath é nulo. Não é possível salvar a imagem.");
                throw new InvalidOperationException("WebRootPath não está configurado, não é possível salvar imagem.");
            }

            var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images");

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            //string? fileName = Path.GetFileNameWithoutExtension(imageFile.FileName);
            //string extension = Path.GetExtension(imageFile.FileName);
            // Garante nome único para o arquivo
            //string newFileName = fileName + DateTime.Now.ToString("yymmddhhmmssfff") + extension;
            //string path = Path.Combine(imagesPath, newFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }
            // Retorna a URL relativa que será salva no banco
            return $"/images/{fileName}";
        }

        // Exclui uma imagem do wwwroot
        private void DeleteImage(string? imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl))
            {
                return;
            }
            // Remove o prefixo '/images/garages/' para obter o nome do arquivo
            string? fileName = Path.GetFileName(imageUrl);

            if (string.IsNullOrEmpty(fileName))
            {
                Console.WriteLine($"AVISO: Não foi possível extrair um nome de arquivo válido da URL: '{imageUrl}'. Imagem não deletada");
                return;
            }

            if (string.IsNullOrEmpty(_webHostEnvironment.WebRootPath))
            {
                Console.Error.WriteLine("ERRO GRAVE: _hostEnvironment.WebRootPath é nulo. Não é possível deletar a imagem.");
                throw new InvalidOperationException("WebRootPath não está configurado, não é possível deletar imagem.");
            }

            var filePath = Path.Combine(_webHostEnvironment.WebRootPath, "images", fileName);

            if (System.IO.File.Exists(filePath))
            {
                try
                {
                    System.IO.File.Delete(filePath);
                }
                catch (Exception ex)
                {
                    // Logar qualquer exceção que ocorra durante a exclusão do arquivo
                    Console.Error.WriteLine($"Erro ao deletar imagem '{filePath}': {ex.Message}");
                    // Você pode decidir como lidar com isso: relançar, registrar no banco de dados, etc.
                }
            }
        }

    }
}
