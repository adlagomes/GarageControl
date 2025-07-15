using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GaragesAPI.Migrations
{
    /// <inheritdoc />
    public partial class RenameNotesToDlcOrTitleUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Notes",
                table: "Vehicles",
                newName: "DlcOrTitleUpdate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DlcOrTitleUpdate",
                table: "Vehicles",
                newName: "Notes");
        }
    }
}
