import { GarageForVehicle } from "./garage-for-vehicle.model";

export interface Vehicle {
  id: number;
  type: string;
  manufacturer: string;
  category: string;
  name: string;
  topSpeed: number;
  seatingCapacity: number;
  carImage: string | null; // A API ainda retornará/esperará uma URL string
  notes: string | null;
  garageId: number;
  garage: GarageForVehicle; // Inclui o DTO simplificado de Garagem
}