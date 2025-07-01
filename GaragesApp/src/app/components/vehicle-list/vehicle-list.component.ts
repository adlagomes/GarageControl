import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessário para diretivas como *ngFor
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // Para navegação e routerLink
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { GarageService, PaginationMetadata } from '../../services/garageService/garage.service'; // Importe o serviço e a interface
import { Vehicle } from '../../models/vehicle.model'; // Importe a interface Vehicle
import { PagedVehiclesResponse, VehicleQueryParams, VehicleService } from '../../services/vehicleService/vehicle.service'; // Importe o serviço de veículos
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-vehicle-list.component',
  standalone: true, // É um componente standalone
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.css'
})
export class VehicleListComponent implements OnInit {
  vehicles: Vehicle[] = [];
  garageId: number | null = null; // Variável para armazenar o ID da garagem
  garageName: string = ''; // Variável para armazenar o nome da garagem
  pagination: PaginationMetadata | null = null;
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizes: number[] = [5, 10, 20, 50];
  filterForm!: FormGroup;
  vehicleTypes: string[] = [
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
  manufacturers: string[] = [
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
  categories: string[] = [
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


  constructor(
    private vehicleService: VehicleService,
    private garageService: GarageService, // Para buscar o nome da garagem
    private route: ActivatedRoute, // Para acessar parâmetros da rota
    private router: Router,
    private notificationService: NotificationService // Para notificações
  ) { }

  ngOnInit(): void {
    this.filterForm = new FormGroup({
      searchQuery: new FormControl(''),
      type: new FormControl(''),
      manufacturer: new FormControl(''),
      category: new FormControl(''),
      minTopSpeed: new FormControl(null),
      maxTopSpeed: new FormControl(null),
      minSeatingCapacity: new FormControl(null),
      maxSeatingCapacity: new FormControl(null),
      sortBy: new FormControl('id'), // Campo de ordenação (e.g., 'name', 'topSpeed')
      sortDirection: new FormControl('asc'), // Direção da ordenação ('asc' ou 'desc')
    });

    this.filterForm.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.loadAllVehicles();
    });
    // Escuta mudanças nos parâmentros da rota (seja /vehicles ou /garages/:garageId/vehicles)
    this.route.paramMap.subscribe(params => {
      const id = params.get('garageId');
      if (id) {
        this.garageId = +id;
        this.loadVehiclesByGarage();
        this.loadGarageName(this.garageId); // Carrega o nome da garagem
      } else {
        this.garageId = null;
        this.loadAllVehicles();
      }
    });
  }

  loadAllVehicles(): void {
    const params: VehicleQueryParams = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      searchQuery: this.filterForm.get('searchQuery')?.value || undefined,
      type: this.filterForm.get('type')?.value || undefined,
      manufacturer: this.filterForm.get('manufacturer')?.value || undefined,
      category: this.filterForm.get('category')?.value || undefined,
      minTopSpeed: this.filterForm.get('minTopSpeed')?.value || undefined,
      maxTopSpeed: this.filterForm.get('maxTopSpeed')?.value || undefined,
      minSeatingCapacity: this.filterForm.get('minSeatingCapacity')?.value || undefined,
      maxSeatingCapacity: this.filterForm.get('maxSeatingCapacity')?.value || undefined,
      sortBy: this.filterForm.get('sortBy')?.value || undefined,
      sortDirection: this.filterForm.get('sortDirection')?.value || undefined,
    };
    this.vehicleService.getVehicles(params).subscribe({
      next: (response: PagedVehiclesResponse) => {
        this.vehicles = response.vehicles;
        this.pagination = response.pagination;
        this.garageName = ''; // Limpa o nome da garagem se estiver vendo todos
      },
      error: (err) => {
        console.error('Erro ao carregar todos os veículos:', err);
        this.notificationService.error('Não foi possível carregar os veículos. Verifique o console para mais detalhes.');
      }
    });
  }

  loadVehiclesByGarage(): void {
    if (this.garageId) {
      this.vehicleService.getVehiclesByGarageId(this.garageId).subscribe({
        next: (data) => {
          this.vehicles = data;
        },
        error: (err) => {
          console.error(`Erro ao carregar veículos da garagem ${this.garageId}:`, err);
          this.notificationService.error('Não foi possível carregar os veículos da garagem. Verifique o console para mais detalhes.');
        }
      });
    }
  }

  loadGarageName(id: number): void {
    this.garageService.getGarageById(id).subscribe({
      next: (data) => {
        this.garageName = data.name;
      },
      error: (err) => {
        console.error(`Erro ao carregar nome da garagem:`, err);
        this.garageName = 'Garagem Desconhecida'; // Define um nome padrão em caso de erro
      }
    });
  }

  editVehicle(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/vehicles/edit', id]);
    }
  }

  deleteVehicle(id: number | undefined): void {
    if (id && confirm('Tem certeza que deseja excluir este veículo?')) {
      this.vehicleService.deleteVehicle(id).subscribe({
        next: () => {
          this.notificationService.success('Veículo excluído com sucesso!');
          // Recarregar a lista dependendo do contexto (todos ou por garagem)
          if (this.garageId) {
            this.loadVehiclesByGarage();
          } else {
            this.loadAllVehicles();
          }
        },
        error: (err) => {
          console.error('Erro ao excluir veículo:', err);
          let errorMessage = 'Não foi possível excluir o veículo.';
          if (err.error && typeof err.error === 'string') {
              errorMessage += ` Erro: ${err.error}`;
          } else if (err.error && err.error.errors) {
              errorMessage += ' Verifique os campos: ' + Object.values(err.error.errors).flat().join('; ');
          }
          this.notificationService.error(errorMessage); // <-- Use o serviço de notificação
        }
      });
    }
  }

  toggleSortDirection(): void {
    const currentDirection = this.filterForm.get('sortDirection')?.value;
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
    this.filterForm.get('sortDirection')?.setValue(newDirection);
    // A chamada para loadVehicles() já será feita pelo valueChanges do filterForm
  }

    // Métodos de Paginação
  goToPage(page: number): void {
    if (this.pagination && page >= 1 && page <= this.pagination.totalPages) {
      this.currentPage = page;
      this.loadAllVehicles();
    }
  }

  onPageSizeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.pageSize = Number(selectElement.value);
    this.currentPage = 1; // Volta para a primeira página ao mudar o tamanho da página
    this.loadAllVehicles();
  }

    // Implementação de getBaseUrl()
  getBaseUrl(): string {
    // Retorna a URL base do seu backend onde as imagens estáticas estão hospedadas
    // Ajuste esta URL se seu backend estiver em um local diferente
    return 'https://localhost:7160';
  }

}
