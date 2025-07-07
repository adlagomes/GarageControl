import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VehicleTypeService {
  private _vehicleTypes: string[] = [
    "Carro Esportivo",
    "Carro Clássico",
    "SUV",
    "Moto",
    "Caminhão",
    "Van",
    "Helicóptero",
    "Avião",
    "Barco",
    "Bicicleta",
    "Buggy",
    "Trator",
    "Blindado",
    "Veículo de Serviço",
    "Ônibus"
  ];

  private _manufacturers: string[] = [
    "Albany",
    "Annis",
    "Benefactor",
    "Bravado",
    "Cheval",
    "Declasse",
    "Dewbauchee",
    "Dinka",
    "Emperor",
    "Gallivanter",
    "Grotti",
    "Imponte",
    "Invetero",
    "Karin",
    "Lampadati",
    "Maibatsu",
    "Obey",
    "Ocelot",
    "Pegassi",
    "Pfister",
    "Progen",
    "Ubermacht",
    "Vapid",
    "Vulcar",
    "Western",
    "Willard",
    "Zirconium"
  ];

  private _categories: string[] = [
    "Compacto",
    "Sedã",
    "SUV",
    "Cupê",
    "Muscle",
    "Esportivo",
    "Esportivo Clássico",
    "Super",
    "Moto",
    "Off-road",
    "Industrial",
    "Utilitário",
    "Van",
    "Ciclo",
    "Barco",
    "Helicóptero",
    "Avião",
    "Serviço",
    "Emergência",
    "Militar",
    "Comercial",
    "Fórmula"
  ];

  constructor() {}

  getVehicleTypes(): Observable<string[]> {
    return of([...this._vehicleTypes]);
  }

  getManufacturers(): Observable<string[]> {
    return of([...this._manufacturers]);
  }

  getCategories(): Observable<string[]> {
    return of([...this._categories]);
  }
}