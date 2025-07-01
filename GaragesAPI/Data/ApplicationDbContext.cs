using GaragesAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace GaragesAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        // DbSets para as entidades
        public DbSet<User> Users { get; set; } // Opcional, se usar a entidade User
        public DbSet<Garage> Garages { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Exemplo de cofiguração de chave estrangeira, se necessário
            // EF Core geralmente infere isso, mas é bom saber
            modelBuilder.Entity<Vehicle>()
                .HasOne(v => v.Garage)
                .WithMany(g => g.Vehicles)
                .HasForeignKey(v => v.GarageId)
                .OnDelete(DeleteBehavior.Cascade); // Quando uma garagem é deletada, seus veículos são deletados.

            modelBuilder.Entity<Garage>()
                .HasOne(g => g.User)
                .WithMany(u => u.Garages)
                .HasForeignKey(g => g.UserId)
                .OnDelete(DeleteBehavior.Restrict); // Evita que um User seja deletado se tiver garagens associadas 

        }
    }
}
