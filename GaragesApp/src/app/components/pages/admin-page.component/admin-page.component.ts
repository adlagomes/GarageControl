import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { GarageService } from '../../../services/garageService/garage.service';
import { VehicleService } from '../../../services/vehicleService/vehicle.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-page.component',
  imports: [CommonModule],
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  isAdmin: boolean = false;
  username: string = '';
  totalProperties: number = 0;
  totalVehicles: number = 0;
  propertiesWithImages: number = 0;
  vehiclesWithImages: number = 0;
  protected readonly environment = environment;


  constructor(
    public authService: AuthService,
    private http: HttpClient,
    private garageService: GarageService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    this.loadData();
  const user = this.authService.getCurrentUser();
  
  if (user) {
    this.username = user.username;
    this.isAdmin = user.role === 'admin';
  } else {
    // Se o perfil ainda não foi carregado, buscar manualmente:
      this.http.get<any>(`${environment.apiUrl}/auth/profile`).subscribe({
        next: (response) => {
          this.authService.setCurrentUser(response);
          this.username = response.username;
          this.isAdmin = response.role === 'admin';
        },
        error: () => {
          this.username = '';
          this.isAdmin = false;
        }
      });
    }
  }

  loadData(): void {

    this.garageService.getGarages().subscribe(response => {
      this.totalProperties = response.pagination.totalCount;
      this.propertiesWithImages = response.garages.filter(garage => garage.imageUrl).length;
    });

    this.vehicleService.getVehicles().subscribe(response => {
      this.totalVehicles = response.pagination.totalCount;
      this.vehiclesWithImages = response.vehicles.filter(vehicle => vehicle.imageUrl).length;
    });
  }
}
