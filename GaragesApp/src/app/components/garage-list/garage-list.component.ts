import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessário para diretivas como *ngFor
import { Router, RouterLink } from '@angular/router'; // Para navegação e routerLink
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'; // Importar ReactiveFormsModule e FormGroup/FormControl
import { GarageService, PagedGaragesResponse, PaginationMetadata, GarageQueryParams } from '../../services/garageService/garage.service'; // Importe o serviço e a interface
import { FormsModule } from '@angular/forms';
import { Garage } from '../../models/garage.model'; // Importe a interface Garage
import { NotificationService } from '../../services/notification.service';
import { PropertyTypeService } from '../../services/property-type.service'; // Importe o novo serviço


@Component({
  selector: 'app-garage-list',
  standalone: true, // É um componente standalone
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule], // Importe CommonModule e RouterLink
  templateUrl: './garage-list.component.html',
  styleUrls: ['./garage-list.component.css']
})
export class GarageListComponent implements OnInit {
  garages: Garage[] = [];
  pagination: PaginationMetadata | null = null;
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizes: number[] = [5, 10, 20, 50]
  filterForm!: FormGroup;
  propertyTypes: string[] = []; // Para popular o dropdown de filtro de tipo

  constructor(
    private garageService: GarageService,
    private router: Router,
    private notificationService: NotificationService,
    private propertyTypeService: PropertyTypeService
  ) { }

  ngOnInit(): void {
    // Inicializar o formulário de filtro
    this.filterForm = new FormGroup({
      searchQuery: new FormControl(''),
      type: new FormControl(''),
      minCapacity: new FormControl<number | null>(null),
      maxCapacity: new FormControl<number | null>(null),
      orderBy: new FormControl('')
    });

    // Carrega os tipos de propriedade do serviço
    this.propertyTypeService.getPropertyTypes().subscribe(types => {
      this.propertyTypes = types;
    });

    // Subscribes para mudanças no formulário de filtro
    this.filterForm.valueChanges.subscribe(() => {
      // Quando os filtros mudam, resetar para a primeira página e carregar
      this.currentPage = 1;
      this.loadGarages();
    });
    this.loadGarages();
  }

  loadGarages(): void {
    const params: GarageQueryParams = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      searchQuery: this.filterForm.get('searchQuery')?.value,
      type: this.filterForm.get('type')?.value,
      minCapacity: this.filterForm.get('minCapacity')?.value,
      maxCapacity: this.filterForm.get('maxCapacity')?.value,
      orderBy: this.filterForm.get('orderBy')?.value
    };
    this.garageService.getGarages(params).subscribe({
      next: (response: PagedGaragesResponse) => {
        this.garages = response.garages;
        this.pagination = response.pagination;
        console.log('Garagens carregadas:', this.garages);
        console.log('Dados de paginação:', this.pagination);
      },
      error: (err) => {
        console.error('Erro ao carregar garagens:', err);
        this.notificationService.error('Não foi possível carregar as garagens. Verifique o console para mais detalhes.');
      }
    });
  }

  // Métodos para paginação
  goToPage(page: number): void {
    if (page >= 1 && page <= (this.pagination?.totalPages || 1)) {
      this.currentPage = page;
      this.loadGarages();
    }
  }

  onPageSizeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.pageSize = Number(selectElement.value);
    this.currentPage = 1; // Volta para a primeira página ao mudar o tamanho da página
    this.loadGarages();
  }

  editGarage(id: number | undefined): void {
    if(id) {
      this.router.navigate(['/garages/edit', id])
    }
  }

  deleteGarage(id: number | undefined): void {
    if(id && confirm('Tem certeza que deseja excluir esta garagem e todos os seus veículos?')) {
      this.garageService.deleteGarage(id).subscribe({
        next: () => {
          this.notificationService.success('Garagem excluída com sucesso!');
          this.loadGarages(); // Recarrega a lista de garagens após exclusão
        },
        error: (err) => {
          console.error('Erro ao excluir garagem:', err);
          let errorMessage = 'Não foi possível excluir a garagem.';
          if (err.error && typeof err.error === 'string') {
              errorMessage += ` Erro: ${err.error}`;
          } else if (err.error && err.error.errors) {
              errorMessage += ' Verifique os campos: ' + Object.values(err.error.errors).flat().join('; ');
          }
          this.notificationService.error(errorMessage);
        }
      }); 
    }
  }

  getBaseUrl(): string {
    return 'https://localhost:7160'
  }
}