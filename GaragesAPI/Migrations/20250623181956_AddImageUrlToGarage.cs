using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GaragesAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddImageUrlToGarage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImageURL",
                table: "Vehicles",
                newName: "ImageUrl");

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Garages",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Garages");

            migrationBuilder.RenameColumn(
                name: "ImageUrl",
                table: "Vehicles",
                newName: "ImageURL");
        }
    }
}
