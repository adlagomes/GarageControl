namespace GaragesAPI.Models
{
    public class User
    {
        public int Id { get; set; } // ou GUID
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        // public string PasswordHash { get; set; } = string.Empty; // para o futuro

        // Relação com Garagens
        public ICollection<Garage> Garages { get; set; } = new List<Garage>();

    }
}
