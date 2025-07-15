import { GarageForVehicle } from "./garage-for-vehicle.model";

export interface Vehicle {
  id: number;
  type: string;
  manufacturer: string;
  category: string;
  name: string;
  topSpeed: number;
  seatingCapacity: number;
  imageUrl?: string; // A API ainda retornará/esperará uma URL string
  dlcOrTitleUpdate?: string | null;
  garageId?: number;
  garage?: GarageForVehicle; // Inclui o DTO simplificado de Garagem
}