// src/app/services/property-type.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyTypeService {

  private propertyTypesList: string[] = [
    'Agência',
    'Apartamento',
    'Arena de Guerra',
    'Boate',
    'Bunker',
    'Cobertura (Penthouse)',
    'Complexo / Arcade',
    'Clube de Motoclube',
    'Depóstio / Galpão de Veículo',
    'Escritório Executivo',
    'Garagem',
    'Hangar',
    'Heliponto',
    'Iate',
    'Instalação',
    'Laboratório de Ácido',
    'Marina',
    'Negócio de Motoclube',
    'Oficina de Veículos'
  ];

  constructor() { }

  // Retorna uma cópia da lista de tipos de propriedade como um Observable
  // Usamos 'of' para simular uma chamada assíncrona, caso no futuro você queira buscar isso de uma API
  getPropertyTypes(): Observable<string[]> {
    return of([...this.propertyTypesList]); // Retorna uma cópia para evitar modificações externas
  }
}