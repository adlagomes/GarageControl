
namespace GaragesAPI.Models
{
    public class User
    {
        public int Id { get; set; } // ou GUID
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;

        public string Role {  get; set; } = "user";

        // Relação com Garagens e veículos
        public ICollection<Garage> Garages { get; set; } = new List<Garage>();
        public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();

        public static implicit operator int(User? v)
        {
            throw new NotImplementedException();
        }
    }
}
