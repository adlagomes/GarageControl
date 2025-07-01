using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GaragesAPI.Migrations
{
    /// <inheritdoc />
    public partial class AlterGarageProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Address",
                table: "Garages",
                newName: "Type");

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "Garages",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StateArea",
                table: "Garages",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Location",
                table: "Garages");

            migrationBuilder.DropColumn(
                name: "StateArea",
                table: "Garages");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Garages",
                newName: "Address");
        }
    }
}
