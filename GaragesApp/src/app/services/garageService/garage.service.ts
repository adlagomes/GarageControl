import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Garage} from '../../models/garage.model';

// Adicione esta interface (se ainda não tiver, para uma versão mais leve da garagem para dropdowns)
// Ou apenas use a interface 'Garage' existente se ela já tiver só os campos necessários
export interface GarageForDropdown {
  id: number;
  name: string;
  // talvez location, capacity se você quiser exibir mais detalhes no dropdown
  capacity?: number;
}

// Definição da interface para os parâmetros da query
export interface GarageQueryParams {
  pageNumber?: number;
  pageSize?: number;
  searchQuery?: string;
  type?: string;
  minCapacity?: number;
  maxCapacity?: number;
  orderBy?: string;
}

// Interface para os metadados da paginação (corresponder ao que o backend envia)
export interface PaginationMetadata {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// Interface para a resposta paginada
export interface PagedGaragesResponse {
  garages: Garage[];
  pagination: PaginationMetadata;
}

// Novas interfaces para DTOs aninhados
export interface VehicleForGarage {
  id: number;
  type: string;
  name: string;
  carImage?: string | null;
}

export interface GarageForVehicle {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class GarageService {
  private apiUrl = 'https://localhost:7160/api/Garages';

  constructor(private http: HttpClient) { }

  getAllGaragesForDropdown(): Observable<Garage[]> {
    return this.http.get<Garage[]>(this.apiUrl);
  }

  // GET: Obter todas as garagens
  getGarages(params: GarageQueryParams = {}): Observable<PagedGaragesResponse> {
    let httpParams = new HttpParams();

    if (params.pageNumber) {
      httpParams = httpParams.append('pageNumber', params.pageNumber.toString());
    }
    if (params.pageSize) {
      httpParams = httpParams.append('pageSize', params.pageSize.toString());
    }
    if (params.searchQuery) {
      httpParams = httpParams.append('searchQuery', params.searchQuery);
    }
    if (params.type) {
      httpParams = httpParams.append('type', params.type);
    }
    if (params.minCapacity) {
      httpParams = httpParams.append('minCapacity', params.minCapacity.toString());
    }
    if (params.maxCapacity) {
      httpParams = httpParams.append('maxCapacity', params.maxCapacity.toString());
    }
    if (params.orderBy) {
      httpParams = httpParams.append('orderBy', params.orderBy);
    }

    return this.http.get<Garage[]>(this.apiUrl, { params: httpParams, observe: 'response'}).pipe(
      map(response => {
        const paginationHeader = response.headers.get('X-Pagination');
        let pagination: PaginationMetadata = {
          totalCount: 0, pageSize: 0, currentPage: 0, totalPages: 0, hasPrevious: false, hasNext: false
        };

        if (paginationHeader) {
          pagination = JSON.parse(paginationHeader);
        }

        return {
          garages: response.body || [],
          pagination: pagination
        };
      })
    );
  }

  getAllGarages(): Observable<Garage[]> {
    return this.http.get<Garage[]>(this.apiUrl)
  }

  // GET: Obter uma garagem por ID
  getGarageById(id: number): Observable<Garage> {
    const url = `${this.apiUrl}/${id}`; 
    return this.http.get<Garage>(url);
  }

  // POST: Criar uma nova garagem
  addGarageWithFile(formData: FormData): Observable<Garage> {
    return this.http.post<Garage>(this.apiUrl, formData);
  }

  // PUT: Atualizar uma garagem existente
  updateGarageWithFile(id: number, formData: FormData): Observable<any> { // https://localhost:7160/api/Garages
    const url = `${this.apiUrl}/${id}`;
    return this.http.put(url, formData);
  }

    // Manter os métodos antigos comentados caso precise de uma versão sem upload
  // addGarage(garage: Garage): Observable<Garage> {
  //   return this.http.post<Garage>(this.apiUrl, garage);
  // }

  // updateGarage(garage: Garage): Observable<any> {
  //   const url = `${this.apiUrl}/${garage.id}`;
  //   return this.http.put(url, garage);
  // }

  // DELETE: Excluir uma garagem
  deleteGarage(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}
