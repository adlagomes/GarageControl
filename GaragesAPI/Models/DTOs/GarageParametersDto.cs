namespace GaragesAPI.Models.DTOs
{
    public class GarageParametersDto
    {
        private const int MaxPageSize = 50; // Limite máximo para o tamanho da página
        public int PageNumber { get; set; } = 1; // Página padrçao é 1

        private int _pageSize = 10; // Tamanho da página padrão
        public int PageSize
            {
                get => _pageSize;
                set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value; // Garante que o tamanho da página não exceda o máximo
            }

        public string? SearchQuery { get; set; } // Termo de pesquisa para nome ou localização
        public string? Type { get; set; } // Filtro por tipo de garagem

        public int? MinCapacity { get; set; }
        public int? MaxCapacity { get; set; }

        public string? OrderBy { get; set; }
    }
}
