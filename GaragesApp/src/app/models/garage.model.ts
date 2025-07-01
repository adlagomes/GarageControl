import { VehicleForGarage } from "./vehicle-for-garage.model";

export interface Garage {
  id: number;
  type: string;
  name: string;
  location: string;
  stateArea: string;
  capacity: number;
  imageUrl?: string;
  vehicles: VehicleForGarage[]; // Adiciona a lista de veículos
}