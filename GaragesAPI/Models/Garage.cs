using System.ComponentModel.DataAnnotations;

namespace GaragesAPI.Models
{
    public class Garage
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "O tipo da propriedade é obrigatório.")]
        [StringLength(50, ErrorMessage = "O tipo não pode exceder 50 caracteres.")]
        public string Type { get; set; } = string.Empty;

        [Required(ErrorMessage = "O nome da garagem é obrigatório.")] // Mensagem de erro explícita
        [StringLength(100, ErrorMessage = "O nome não pode exceder 100 caracteres.")] // Adicionei StringLength
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "A localidade da propriedade é obrigatória.")]
        [StringLength(200, ErrorMessage = "A localidade não pode exceder 200 caracteres.")] // Adicionei StringLength
        public string Location { get; set; } = string.Empty;

        [Required(ErrorMessage = "O Estado/Área da propriedade é obrigatório.")]
        [StringLength(50, ErrorMessage = "O Estado/Área não pode exceder 50 caracteres.")] // Adicionei StringLength
        public string StateArea {  get; set; } = string.Empty;

        [Required(ErrorMessage = "A capacidade da garagem é obrigatória.")] // Mensagem de erro explícita
        [Range(1, int.MaxValue, ErrorMessage = "A capacidade deve ser pelo menos 1.")]
        public int Capacity { get; set; }

        public string? ImageUrl { get; set; }

        // Chave estrangeira para User (se estiver usando a entidade User)
        public int? UserId { get; set; } // Nullable se User for opcional
        public User? User { get; set; } // Propriedade de navegação.

        // Relação com Veículos
        public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();

    }
}
