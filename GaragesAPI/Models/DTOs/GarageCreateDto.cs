using System.ComponentModel.DataAnnotations;

namespace GaragesAPI.Models.DTOs
{
    public class GarageCreateDto
    {
        [Required(ErrorMessage = "O tipo da propriedade é obrigatório.")]
        public string Type { get; set; } = string.Empty;

        [Required(ErrorMessage = "O nome da garagem é obrigatório.")]
        [StringLength(100, ErrorMessage = "O nome não pode exceder 100 caracteres.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "A localidade da propriedade é obrigatória.")]
        [StringLength(200, ErrorMessage = "A localidade não pode exceder 200 caracteres.")]
        public string Location { get; set; } = string.Empty;

        [Required(ErrorMessage = "O Estado/Área da propriedade é obrigatório.")]
        public string StateArea {  get; set; } = string.Empty;

        [Range(1, 1000, ErrorMessage = "A capacidade deve ser entre 1 e 1000.")]
        public int Capacity { get; set; }

        public IFormFile? ImageFile { get; set; }

        public string? ImageUrl { get; set; }


    }
}
