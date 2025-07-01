using System.ComponentModel.DataAnnotations;

namespace GaragesAPI.Models
{
    public class Vehicle
    {
        public int Id { get; set; }

        public string Type { get; set; } = string.Empty; // Ex: "Carro", "Moto", "Caminhão" etc
        public string? Manufacturer { get; set; }
        public string? Category { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty; // Ex: ""Comet Retro Custom"
        public double? TopSpeed { get; set; }
        public int? SeatingCapacity { get; set; }

        public string? ImageUrl { get; set; } // URL para imagem, pode ser nulo

        public string? Notes {  get; set; } // Anotações adicionais.

        [Required]
        public int GarageId { get; set; }
        public Garage? Garage {  get; set; } // Propriedade de navegação
    }
}
