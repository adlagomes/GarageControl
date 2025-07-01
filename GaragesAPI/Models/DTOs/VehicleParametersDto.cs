namespace GaragesAPI.Models.DTOs
{
    public class VehicleParametersDto
    {
        private const int MaxPageSize = 50; // Limite máximo para o tamanho da página
        public int PageNumber { get; set; } = 1; // Página padrão é 1

        private int _pageSize = 10; // Tamanho da página padrão
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value; // Garante que o tamanho da página não exceda o máximo
        }

        public string? Type { get; set; } // Filtro por tipo de veículo
        public string? Manufacturer { get; set; }
        public string? Category { get; set; }
        public string? SearchQuery { get; set; } // Termo de pesquisa para nome
        //public double? TopSpeed { get; set; }
        //public int? SeatingCapacity { get; set; }

        public int? MinTopSpeed { get; set; }
        public int? MaxTopSpeed { get; set; }
        public int? MinSeatingCapacity { get; set; }
        public int? MaxSeatingCapacity { get; set; }

        public string? SortBy { get; set; } // O campo pelo qual ordenar (e.g., "Name", "TopSpeed")
        public string SortDirection { get; set; } = "asc"; // "asc" (padrão) ou "desc"

    }
}
