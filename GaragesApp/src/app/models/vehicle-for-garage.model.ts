// src/app/models/vehicle-for-garage.model.ts
// Esta interface representa o DTO simplificado de Veículo
// que pode ser incluído dentro de um GarageDto do backend (se sua API o fornecer).
export interface VehicleForGarage {
  id: number;
  name: string;
  // Adicione outras propriedades se o backend enviar e você precisar (ex: type, imageUrl)
  // type: string;
  // imageUrl: string | null;
}