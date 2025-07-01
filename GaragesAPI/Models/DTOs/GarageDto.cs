namespace GaragesAPI.Models.DTOs
{
    public class GarageDto
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string StateArea {  get; set; } = string.Empty;
        public int Capacity { get; set; }
        public int NumberOfVehicles { get; set; } // Nova propriedade para contar veículos

        public string? ImageUrl { get; set; }

        // Uma lista de VehicleDto para que ao buscar a garagem, os veículos também venham
        // Mas, usaremos uma versão simplificada aqui para evitar recursão
        public ICollection<VehicleForGarageDto>? Vehicles { get; set; }
    }
}
