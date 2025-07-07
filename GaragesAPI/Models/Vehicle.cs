using System.ComponentModel.DataAnnotations;

namespace GaragesAPI.Models
{
    public class Vehicle
    {
        public int Id { get; set; }

        [Required] public string Type { get; set; } = string.Empty;
        [Required] public string Manufacturer { get; set; } = string.Empty;
        [Required] public string Category { get; set; } = string.Empty;
        [Required] public string Name { get; set; } = string.Empty;
        [Required] public int SeatingCapacity { get; set; }
        public double? TopSpeed { get; set; }
        public string? ImageUrl { get; set; }
        public string? Notes {  get; set; }
        public int? GarageId { get; set; }
        public Garage? Garage {  get; set; }
    }
}
