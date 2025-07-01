using AutoMapper;
using GaragesAPI.Models;
using GaragesAPI.Models.DTOs;

namespace GaragesAPI.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Mapeamento de Garage para GarageDto
            CreateMap<Garage, GarageDto>()
                .ForMember(dest => dest.NumberOfVehicles,
                           opt => opt.MapFrom(src => src.Vehicles != null ? src.Vehicles.Count : 0)); // Calcula veículos

            // Mapeamento de GarageCreateUpdateDto para Garage
            CreateMap<GarageCreateUpdateDto, Garage>()
                .ForMember(dest => dest.Id, opt => opt.Condition(src => src.Id > 0)) // Id só é mapeado se > 0 (para update)
                .ForMember(dest => dest.ImageUrl, opt => opt.Ignore()) // ImageUrl será setado manualmente
                .ForMember(dest => dest.Vehicles, opt => opt.Ignore()); // Ignore Vehicles

            // Mapeamento simplificado de Garage para uso dentro de VehicleDto
            CreateMap<Garage, GarageForVehicleDto>();

            // Mapeamento de Vehicle para VehicleDto
            CreateMap<Vehicle, VehicleDto>();

            // Mapeamento simplificado de Vehicle para uso dentro de GarageDto
            CreateMap<Vehicle, GarageDto>();

            // Mapeamentp de VehicleCreateDto para Vehicle (criação)
            CreateMap<VehicleCreateDto, Vehicle>()
                .ForMember(dest => dest.ImageUrl, opt => opt.Ignore()); // <-- ADICIONAR ESTA LINHA


            // Mapeamento de VehicleUpdateDto para Vehicle (atualização)
            CreateMap<VehicleUpdateDto, Vehicle>()
                .ForMember(dest => dest.ImageUrl, opt => opt.Ignore()); // <-- ADICIONAR ESTA LINHA


            // Mapeamento de Vehicle para VehicleForGarageDto (para uso dentro de GarageDto)
            CreateMap<Vehicle, VehicleForGarageDto>();
        }
    }
}
