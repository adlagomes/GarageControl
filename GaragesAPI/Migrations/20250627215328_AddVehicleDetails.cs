using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GaragesAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddVehicleDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Vehicles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Manufacturer",
                table: "Vehicles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SeatingCapacity",
                table: "Vehicles",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "TopSpeed",
                table: "Vehicles",
                type: "float",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "Garages",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "StateArea",
                table: "Garages",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Garages",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Location",
                table: "Garages",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "Manufacturer",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "SeatingCapacity",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "TopSpeed",
                table: "Vehicles");

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "Garages",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "StateArea",
                table: "Garages",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Garages",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Location",
                table: "Garages",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);
        }
    }
}
