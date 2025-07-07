using System.ComponentModel.DataAnnotations;

namespace GaragesAPI.Models.DTOs
{
    public class VehicleUpdateDto
    {
        [Required(ErrorMessage = "O ID do veículo é obrigatório para atualização.")]
        public int Id { get; set; }

        [Required(ErrorMessage = "O tipo do veículo é obrigatório.")]
        [StringLength(50, ErrorMessage = "O tipo não pode exceder 50 caracteres.")]
        public string Type { get; set; } = string.Empty;
        public string? Manufacturer { get; set; }
        public string? Category { get; set; }

        [Required(ErrorMessage = "O nome do veículo é obrigatório.")]
        [StringLength(100, ErrorMessage = "O nome não pode exceder 100 caracteres.")]
        public string Name { get; set; } = string.Empty;
        public double? TopSpeed { get; set; }
        public int? SeatingCapacity { get; set; }

        [Url(ErrorMessage = "A URL da imagem não é válida.")]
        public string? ImageUrl { get; set; }

        [StringLength(140, ErrorMessage = "As notas não podem exceder 140 caracteres.")]
        public string? Notes { get; set; }

        public int? GarageId { get; set; }
        public IFormFile? ImageFile { get; set; }
    }
}
