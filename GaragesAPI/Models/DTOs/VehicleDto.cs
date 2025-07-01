namespace GaragesAPI.Models.DTOs
{
    public class VehicleDto
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string? Manufacturer { get; set; }
        public string? Category { get; set; }
        public string Name { get; set; } = string.Empty;
        public double? TopSpeed { get; set; }
        public int? SeatingCapacity { get; set; }
        public string? ImageUrl { get; set; }
        public string? Notes { get; set; }
        public int GarageId { get; set; }

        // Inclui apenas um resumo da garagem para evitar ciclos
        public GarageForVehicleDto? Garage {  get; set; }

    }
}
