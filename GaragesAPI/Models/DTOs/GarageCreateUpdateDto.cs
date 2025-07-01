using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http; // Necessário para IFormFile

namespace GaragesAPI.Models.DTOs
{
    public class GarageCreateUpdateDto
    {
        // ID é necessário apenas para atualização. Para criação, pode ser 0 ou omitido.
        // Usamos [Required] com um Range para garantir que seja válido para update,
        // mas o controlador deve lidar com o ID da rota.
        public int Id { get; set; }

        [Required(ErrorMessage = "O tipo da propriedade é obrigatório.")]
        [StringLength(50, ErrorMessage = "O tipo não pode exceder 50 caracteres.")]
        public string Type { get; set; } = string.Empty;

        [Required(ErrorMessage = "O nome da garagem é obrigatório.")]
        [StringLength(100, ErrorMessage = "O nome não pode exceder 100 caracteres.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "A localidade da propriedade é obrigatória.")]
        [StringLength(200, ErrorMessage = "A localidade não pode exceder 200 caracteres.")]
        public string Location { get; set; } = string.Empty;

        [Required(ErrorMessage = "O Estado/Área da propriedade é obrigatório.")]
        [StringLength(50, ErrorMessage = "O Estado/Área não pode exceder 50 caracteres.")]
        public string StateArea { get; set; } = string.Empty;

        [Range(1, 1000, ErrorMessage = "A capacidade deve ser entre 1 e 1000.")]
        [Required(ErrorMessage = "A capacidade da garagem é obrigatória.")] // Adicionado Required
        public int Capacity { get; set; }

        // Campo para upload de um novo arquivo de imagem
        public IFormFile? ImageFile { get; set; }

        // Indica se a imagem existente deve ser removida.
        // O frontend deve enviar "true" ou "false" para este campo.
        // Para update, se ImageFile for null e RemoveExistingImage for true, a imagem atual é removida.
        // Para create, este campo não é relevante.
        public bool RemoveExistingImage { get; set; } = false; // Valor padrão é false
    }
}
