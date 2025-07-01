using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace GaragesAPI.Models.DTOs
{
    public class VehicleCreateDto
    {
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

        public string? ImageUrl { get; set; }
        public IFormFile? ImageFile { get; set; }

        [StringLength(500, ErrorMessage = "As notas não podem exceder 500 caracteres.")]
        public string? Notes { get; set; }

        [Required(ErrorMessage = "A garagem é obrigatória.")]
        [Range(1, int.MaxValue, ErrorMessage = "Selecione uma garagem válida.")]
        public int GarageId { get; set; }
    }
}
