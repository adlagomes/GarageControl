﻿namespace GaragesAPI.Models.DTOs
{
    public class VehicleForGarageDto
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
    }
}