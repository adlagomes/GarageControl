import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vehicle } from '../../models/vehicle.model'; // Certifique-se de que o caminho está correto
import { PaginationMetadata } from '../garageService/garage.service';

export interface VehicleQueryParams {
  pageNumber?: number;
  pageSize?: number;
  searchQuery?: string;
  type?: string;
  manufacturer?: string;
  category?: string;
  minTopSpeed?: number;
  maxTopSpeed?: number;
  minSeatingCapacity?: number;
  maxSeatingCapacity?: number;
  // Novos para ordenação
  sortBy?: string;
  sortDirection?: string; // 'asc' ou 'desc'
}

export interface PagedVehiclesResponse {
  vehicles: Vehicle[];
  pagination: PaginationMetadata;
}

@Injectable({
  providedIn: 'root'
})

export class VehicleService {
  private apiUrl = 'https://localhost:7160/api/Vehicles';

  constructor(private http: HttpClient) { }

  // GET: Obter todos os veículos
  getVehicles(params?: VehicleQueryParams): Observable<PagedVehiclesResponse> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.pageNumber) httpParams = httpParams.append('pageNumber', params.pageNumber.toString());
      if (params.pageSize) httpParams = httpParams.append('pageSize', params.pageSize.toString());
      if (params.searchQuery) httpParams = httpParams.append('searchQuery', params.searchQuery);
      if (params.type) httpParams = httpParams.append('type', params.type);
      if (params.manufacturer) httpParams = httpParams.append('manufacturer', params.manufacturer);
      if (params.category) httpParams = httpParams.append('category', params.category);
      if (params.minTopSpeed) httpParams = httpParams.append('minTopSpeed', params.minTopSpeed.toString());
      if (params.maxTopSpeed) httpParams = httpParams.append('maxTopSpeed', params.maxTopSpeed.toString());
      if (params.minSeatingCapacity) httpParams = httpParams.append('minSeatingCapacity', params.minSeatingCapacity.toString());
      if (params.maxSeatingCapacity) httpParams = httpParams.append('maxSeatingCapacity', params.maxSeatingCapacity.toString());
      
      // Novos para ordenação
      if (params.sortBy) httpParams = httpParams.append('sortBy', params.sortBy);
      if (params.sortDirection) httpParams = httpParams.append('sortDirection', params.sortDirection);
    }
    return this.http.get<Vehicle[]>(this.apiUrl, { observe: 'response', params: httpParams }).pipe(
      map(response => {
        const paginationHeader = response.headers.get('X-Pagination');
        let pagination: PaginationMetadata = {
          totalCount: 0, pageSize: 0, currentPage: 0, totalPages: 0, hasPrevious: false, hasNext: false
        };

        if (paginationHeader) {
          pagination = JSON.parse(paginationHeader);
        }

        return {
          vehicles: response.body || [],
          pagination: pagination
        };
      })
    );
  }

  // GET: Obter um veículo por ID
  getVehicleById(id: number): Observable<Vehicle> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Vehicle>(url);
  }

  // GET: Obter veículos por ID da garagem
  getVehiclesByGarageId(garageId: number): Observable<Vehicle[]> {
    const url = `https://localhost:7160/api/Garages/${garageId}/Vehicles`;
    return this.http.get<Vehicle[]>(url);
  }

  // **NOVOS MÉTODOS QUE ACEITAM FormData**
  addVehicleWithFile(formData: FormData): Observable<any> {
    // Opcionalidade: se FormData não tiver 'ImageFile', o backend o verá como null.
    return this.http.post(this.apiUrl, formData);
  }

  updateVehicleWithFile(id: number, formData: FormData): Observable<any> {
    // Opcionalidade: se FormData não tiver 'ImageFile', o backend o verá como null.
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  // DELETE: Excluir um veículo
  deleteVehicle(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}
