using AutoMapper;
using GaragesAPI.Data;
using GaragesAPI.Models;
using GaragesAPI.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Linq;
using System.Net.Http.Headers;

namespace GaragesAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehiclesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _hostEnvironment;

        public VehiclesController(ApplicationDbContext context, IMapper mapper, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            _mapper = mapper;
            _hostEnvironment = hostEnvironment;
        }

        // GET; api/Vehicles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VehicleDto>>> GetVehicles([FromQuery] VehicleParametersDto parameters)
        {
            if (_context.Vehicles == null)
                return Problem("A entidade Vehicles está nula.");

            var collection = _context.Vehicles.Include(v => v.Garage).AsQueryable();

            // Filtro textual
            if (!string.IsNullOrWhiteSpace(parameters.SearchQuery))
            {
                var search = parameters.SearchQuery.Trim().ToLower();
                collection = collection.Where(v =>
                    (!string.IsNullOrEmpty(v.Name) && v.Name.ToLower().Contains(search)) ||
                    (!string.IsNullOrEmpty(v.Type) && v.Type.ToLower().Contains(search)) ||
                    (!string.IsNullOrEmpty(v.Manufacturer) && v.Manufacturer.ToLower().Contains(search)) ||
                    (!string.IsNullOrEmpty(v.Category) && v.Category.ToLower().Contains(search)) ||
                    (!string.IsNullOrEmpty(v.Notes) && v.Notes.ToLower().Contains(search))
                );
            }

            // Filtros diretos
            if (!string.IsNullOrWhiteSpace(parameters.Type))
                    collection = collection.Where(v => v.Type == parameters.Type);

            if (!string.IsNullOrWhiteSpace(parameters.Manufacturer))
                collection = collection.Where(v => v.Manufacturer == parameters.Manufacturer);

            if (!string.IsNullOrWhiteSpace(parameters.Category))
                collection = collection.Where(v => v.Category == parameters.Category);

            if (parameters.MinTopSpeed.HasValue)
                collection = collection.Where(v => v.TopSpeed >= parameters.MinTopSpeed.Value);

            if (parameters.MaxTopSpeed.HasValue)
                collection = collection.Where(v => v.TopSpeed >= parameters.MaxTopSpeed.Value);

            if (parameters.MinSeatingCapacity.HasValue)
                collection = collection.Where(v => v.SeatingCapacity >= parameters.MinSeatingCapacity.Value);

            if (parameters.MaxSeatingCapacity.HasValue)
                collection = collection.Where(v => v.SeatingCapacity >= parameters.MaxSeatingCapacity.Value);

            // Ordenação dinâmica
            string sortBy = parameters.SortBy?.ToLower() ?? "id";
            string sortDir = parameters.SortDirection?.ToLower() ?? "asc";

            collection = (sortBy, sortDir) switch
            {
                ("name", "desc") => collection.OrderByDescending(v => v.Name),
                ("name", _) => collection.OrderBy(v => v.Name),
                ("type", "desc") => collection.OrderByDescending(v => v.Type),
                ("type", _) => collection.OrderBy(v => v.Type),
                ("manufacturer", "desc") => collection.OrderByDescending(v => v.Manufacturer),
                ("manufacturer", _) => collection.OrderBy(v => v.Manufacturer),
                ("category", "desc") => collection.OrderByDescending(v => v.Category),
                ("category", _) => collection.OrderBy(v => v.Category),
                ("topspeed", "desc") => collection.OrderByDescending(v => v.TopSpeed),
                ("topspeed", _) => collection.OrderBy(v => v.TopSpeed),
                ("seatingcapacity", "desc") => collection.OrderByDescending(v => v.SeatingCapacity),
                ("seatingcapacity", _) => collection.OrderBy(v => v.SeatingCapacity),
                ("id", "desc") => collection.OrderByDescending(v => v.Id),
                _ => collection.OrderBy(v => v.Id)
            };

            // --- Paginação ---
            int totalCount = await collection.CountAsync();
            int pageSize = parameters.PageSize <= 0 ? 10 : parameters.PageSize;
            int currentPage = parameters.PageNumber <= 0 ? 1 : parameters.PageNumber;

            int totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            var vehicles = await collection
                .Skip((currentPage - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var paginationMetadata = new
            {
                totalCount,
                pageSize,
                currentPage,
                totalPages,
                hasPrevious = currentPage > 1,
                hasNext = currentPage < totalPages
            };

            Response.Headers.Append("X-Pagination", // usei Append ao invés de Add por orientação da IA do visual studio
                System.Text.Json.JsonSerializer.Serialize(paginationMetadata));

            return Ok(_mapper.Map<IEnumerable<VehicleDto>>(vehicles));
        }


        // GET: api/Vehicles/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<VehicleDto>> GetVehicle(int id)
        {
            var vehicle = await _context.Vehicles
                .Include(v => v.Garage)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (vehicle == null)
                return NotFound();

            return _mapper.Map<VehicleDto>(vehicle);
        }

        //Rota específica para veículos de uma garagem
        // GET: api/Garages/{garageId}/Vehicles
        [HttpGet("/api/Garages/{garageId}/Vehicles")] 
        public async Task<ActionResult<IEnumerable<VehicleDto>>> GetVehiclesForGarage(int garageId)
        {
            var vehicles = await _context.Vehicles
                .Where(v => v.GarageId == garageId)
                .Include(v => v.Garage)
                .ToListAsync();

            if (!vehicles.Any())
                return NotFound($"Garagem com ID {garageId} não encontrada ou não possui veículos.");

            return Ok(_mapper.Map<IEnumerable<VehicleDto>>(vehicles));
        }

        // POST: api/Vehicles
        [HttpPost]
        public async Task<ActionResult<VehicleDto>> AddVehicle([FromForm] VehicleCreateDto vehicleCreateDto)
        {
            if (!await _context.Garages.AnyAsync(g => g.Id == vehicleCreateDto.GarageId))
                return BadRequest($"Garagem com ID {vehicleCreateDto.GarageId} não encontrada.");

            var vehicle = _mapper.Map<Vehicle>(vehicleCreateDto);

            if (vehicleCreateDto.ImageFile != null)
                vehicle.ImageUrl = await SaveImage(vehicleCreateDto.ImageFile);

            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();

            // Inlcui a garagem para o DTO retornado
            await _context.Entry(vehicle).Reference(v => v.Garage).LoadAsync();

            var resultDto = _mapper.Map<VehicleDto>(vehicle);

            return CreatedAtAction(nameof(GetVehicle), new { id = resultDto.Id }, resultDto);
        }

        // PUT: api/Vehicle/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVehicle(int id, [FromForm] VehicleUpdateDto vehicleUpdateDto)
        {
            if (id != vehicleUpdateDto.Id)
                return BadRequest("ID da URL não corresponde ao veículo informado.");

            // Validação de mudança de garagem e capacidade
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
                return NotFound();

            // Se um novo arquivo de imagem foi enviado
            if (vehicleUpdateDto.ImageFile != null)
            {
                // Excluir a imagem antiga
                if (!string.IsNullOrEmpty(vehicle.ImageUrl))
                    DeleteImage(vehicle.ImageUrl);

                vehicle.ImageUrl = await SaveImage(vehicleUpdateDto.ImageFile);
            }
            else if (HttpContext.Request.Form.TryGetValue("RemoveExistingImage", out var removeImage) && removeImage == "true")
            {
                if (!string.IsNullOrEmpty(vehicle.ImageUrl))
                        DeleteImage(vehicle.ImageUrl);
              
                vehicle.ImageUrl = null;
            }

            _mapper.Map(vehicleUpdateDto, vehicle); // Mapeia DTO para a entidade existente
            _context.Entry(vehicle).State = EntityState.Modified;

            /* COMENTADO POR REFATORAÇÃO. VERIFICAR SE NÃO OCORRE ERRO
            vehicle.Type = vehicleUpdateDto.Type;
            vehicle.Name = vehicleUpdateDto.Name;
            vehicle.Notes = vehicleUpdateDto.Notes;
            vehicle.GarageId = vehicleUpdateDto.GarageId;
            */

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Vehicles.Any(v => v.Id == id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Vehicle/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
                return NotFound();

            if (!string.IsNullOrEmpty(vehicle.ImageUrl))
                DeleteImage(vehicle.ImageUrl);

            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /* VERIFICAR SE NÃO OCORRE ERRO. SE HOUVER, DESCOMENTAR
        private bool VehicleExists(int id)
        {
            return (_context.Vehicles?.Any(e => e.Id == id)).GetValueOrDefault();
        }
        */

        // Helpers
        private async Task<string> SaveImage(IFormFile imageFile)
        {
            string fileName = Path.GetFileNameWithoutExtension(imageFile.FileName);
            string extension = Path.GetExtension(imageFile.FileName);
            string newFileName = fileName + DateTime.Now.ToString("yymmddhhmmssfff") + extension;
            string path = Path.Combine(_hostEnvironment.WebRootPath, "images", newFileName);

            using var fileStream = new FileStream(path, FileMode.Create);
            await imageFile.CopyToAsync(fileStream);

            return $"/images/{newFileName}";
        }

        private void DeleteImage(string imageUrl)
        {
            string fileName = Path.GetFileName(imageUrl);
            string path = Path.Combine(_hostEnvironment.WebRootPath, "images", fileName);

            if (System.IO.File.Exists(path))
                System.IO.File.Delete(path);
        }
    }
}
