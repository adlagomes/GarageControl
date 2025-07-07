import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Para usar ngModel
import { Vehicle } from '../../models/vehicle.model';
import { Garage } from '../../models/garage.model';
import { GarageService } from '../../services/garageService/garage.service';
import { VehicleService } from '../../services/vehicleService/vehicle.service';
import { NotificationService } from '../../services/notification.service';
import { VehicleTypeService } from '../../services/vehicleService/vehicle-type.service';

@Component({
  selector: 'app-vehicle-form',
  standalone: true, // É um componente standalone
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehicle-form.component.html',
  styleUrl: './vehicle-form.component.css'
})
export class VehicleFormComponent implements OnInit {
  vehicleForm!: FormGroup; // Formulário reativo para o veículo
  isEditMode: boolean = false; // Variável para controlar o modo de edição
  vehicleId: number | null = null; // Variável para armazenar o ID do veículo
  garages: Garage[] = []; // Lista de garagens para o dropdown
  selectedFile: File | null = null; // Variável para armazenar o arquivo selecionado
  currentCarImagePreview: string | null = null; // Variável para armazenar a pré-visualização da imagem do carro
  imageFileError: string | null = null; // Variável para armazenar erros de validação de imagem
  originalImageUrl: string | null = null;

  vehicleTypes: string[] = [];
  manufacturers: string[] = [];
  categories: string[] = [];

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private garageService: GarageService,
    private route: ActivatedRoute,
    public router: Router,
    private notificationService: NotificationService,
    private vehicleTypeService: VehicleTypeService
  ) { }

  ngOnInit(): void {
    this.vehicleForm = this.fb.group({
      id: [0], // ID do veículo, usado apenas no modo de edição
      type: ['', [Validators.required]], // Tipo do veículo
      name: ['', [Validators.required, Validators.maxLength(100)]], // Nome do veículo
      manufacturer: ['', [Validators.required]],
      category: ['', [Validators.required]],
      topSpeed: [null],
      seatingCapacity: [null, [Validators.required]],
      garageId: [0, [Validators.required, Validators.min(1)]], // Garagem é obrigatória e deve ter ID > 0
      notes: ['', [Validators.maxLength(140)]], // Notas adicionais do veículo
      removeExistingImage: [false]
    });

    this.vehicleTypeService.getVehicleTypes().subscribe(types => {
      this.vehicleTypes = types;
    })
    this.vehicleTypeService.getManufacturers().subscribe(manufacturers => {
      this.manufacturers = manufacturers;
    });
    this.vehicleTypeService.getCategories().subscribe(categories => {
      this.categories = categories;
    });

    this.loadGarages();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.vehicleId = +id; // Converte string para número
        this.loadVehicle(this.vehicleId); // Carrega o veículo para edição
      }
    });


  }

  loadGarages(): void {
    this.garageService.getAllGarages().subscribe({
      next: (data: Garage[]) => {
        this.garages = data;
        // Se estiver adicionando e não houver garagens, defina um valor padrão
        if (!this.isEditMode && this.garages.length === 0) {
          this.notificationService.warning('Nenhuma garagem disponível. Por favor, adicione uma garagem primeiro.');
        }
      },
      error: (err) => {
        console.error('Erro ao carregar garagens:', err);
        this.notificationService.error('Não foi possível carregar as garagens. Verifique o console para mais detalhes.');
      }
    });
  }

  loadVehicle(id: number): void {
    this.vehicleService.getVehicleById(id).subscribe({
      next: (vehicle: Vehicle) => {
        this.vehicleForm.patchValue(vehicle);  // Preenche o formulário com os dados do veículo
        this.originalImageUrl = vehicle.imageUrl || null;

        if (this.originalImageUrl) {
          this.currentCarImagePreview = this.getBaseUrl() + this.originalImageUrl; // Define a pré-visualização da imagem do carro se existir
        }

        this.vehicleForm.get('removeExistingImage')?.setValue(false, { emitEvent: false }); // Reseta o arquivo selecionado
      },
      error: (err) => {
        console.error('Erro ao carregar veículo para edição:', err);
        this.notificationService.error('Não foi possível carregar o veículo. Verifique o console para mais detalhes.');
        this.router.navigate(['/vehicles']); // Redireciona para a lista de veículos em caso de erro
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0]; // Obtém o primeiro arquivo selecionado

      this.imageFileError = null; // Reseta o erro de arquivo de imagem

      // Valida o tipo dfe arquivo
      if (!file.type.startsWith('image/')) {
        this.imageFileError = 'Por favor, selecione um arquivo de imagem válido.';
        this.selectedFile = null; // Reseta o arquivo selecionado
        this.currentCarImagePreview = null; // Reseta a pré-visualização da imagem
        input.value = ''; // Limpa o input para permitir a seleção do mesmo arquivo novamente
        return;
      }

      // Valida o tamanho do arquivo
      if (file.size > 2 * 1024 * 1024) { // Verifica se o tamanho do arquivo é maior que 2MB
        this.imageFileError = 'O arquivo de imagem não pode ser maior que 2MB.';
        this.selectedFile = null; // Reseta o arquivo selecionado
        this.currentCarImagePreview = null; // Reseta a pré-visualização da imagem
        input.value = '';
        return;
      }

      // Armazena o arquivo e cria uma pré-visualização
      this.selectedFile = file;
      this.vehicleForm.get('removeExistingImage')?.setValue(false, { emitEvent: false });

      const reader = new FileReader();
      reader.onload = () => {
        this.currentCarImagePreview = reader.result as string; // Define a pré-visualização da imagem
        const uploadButton = document.querySelector('.add-photo-button') as HTMLElement;
        if (uploadButton) {
          uploadButton.style.background = `url(${this.currentCarImagePreview})`;
        }
      };
      reader.readAsDataURL(file); // Lê o arquivo como URL de dados
    } else {
      // Se nenhum arquivo for selecionado, reseta as variáveis
      this.selectedFile = null;
      // Se não estiver em modo de edição, reseta a pré-visualização da imagem
      if (!this.isEditMode || (this.isEditMode && !this.vehicleForm.get('imageUrl')?.value)) {
        this.currentCarImagePreview = null;
      } // Reseta o erro de arquivo de imagem
    }
  }

  onSubmit(): void {
    if (this.vehicleForm.invalid) {
      this.notificationService.error('Por favor, preencha todos os campos obrigatórios corretamente.');
      this.vehicleForm.markAllAsTouched(); // Marca todos os campos como tocados para exibir erros
      return;
    }

    // Verifica se há erros de arquivo de imagem antes de enviar
    if (this.imageFileError) {
      this.notificationService.error('Corrija os erros de arquivo de imagem antes de enviar.');
      return;
    }

    // Cria um FormData para enviar os dados do veículo e o arquivo de imagem
    const formData = new FormData();

    // Anexa os campos do formulário ao FormData
    formData.append('id', this.vehicleForm.get('id')?.value);
    formData.append('type', this.vehicleForm.get('type')?.value);
    formData.append('manufacturer', this.vehicleForm.get('manufacturer')?.value);
    formData.append('category', this.vehicleForm.get('category')?.value);
    formData.append('name', this.vehicleForm.get('name')?.value);
    formData.append('topSpeed', this.vehicleForm.get('topSpeed')?.value);
    formData.append('seatingCapacity', this.vehicleForm.get('seatingCapacity')?.value);
    formData.append('notes', this.vehicleForm.get('notes')?.value);
    formData.append('garageId', this.vehicleForm.get('garageId')?.value);

    // Anexa o arquivo de imagem se estiver selecionado
    if (this.selectedFile) {
      formData.append('imageFile', this.selectedFile, this.selectedFile.name); // Adiciona o arquivo de imagem ao FormData
    } else if (this.isEditMode && !this.currentCarImagePreview && !this.selectedFile) {
      formData.append('RemoveExistingImage',  this.vehicleForm.get('removeExistingImage')?.value.toString());
    }
    const serviceCall = this.isEditMode
      ? this.vehicleService.updateVehicleWithFile(this.vehicleId!, formData)
      : this.vehicleService.addVehicleWithFile(formData);

    serviceCall.subscribe({
      next: () => {
        this.notificationService.success(this.isEditMode ? 'Veículo atualizado com sucesso!' : 'Veículo adicionado com sucesso!');
        this.router.navigate(['/vehicles']); // Redireciona para a lista de veículos após sucesso
      },
      error: (err) => {
        console.error(`Erro ao ${this.isEditMode ? 'atualizar' : 'adicionar'} veículo:`, err);
        let errorMessage = `Não foi possível ${this.isEditMode ? 'atualizar' : 'adicionar'} o veículo.`;
        if (err.error && typeof err.error === 'string') {
          errorMessage += ` Erro: ${err.error}`; // Se a API retornar uma string
      } else if (err.error && typeof err.error.erros) {
        errorMessage += ` Verifique os campos: ${Object.values(err.error.erros).flat().join('; ')}`; // Concatena os erros
        }
        this.notificationService.error(errorMessage);
      }
    });
  }

  removeImage(): void {
    this.selectedFile = null;
    this.currentCarImagePreview = null;
    this.vehicleForm.get('removeExistingImage')?.setValue(true);

    if(this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }

    const uploadButton = document.querySelector('.add-photo-button') as HTMLElement;
    if (uploadButton) {
      uploadButton.style.background = '';
    }
  }

  isFieldInvalid(field: string): boolean | undefined {
    const control = this.vehicleForm.get(field);
    return control?.invalid && (control?.dirty || control?.touched)
  }

  getBaseUrl(): string {
    return 'https://localhost:7160';
  }

  private markAllAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markAllAsTouched(control);
      }
    });
  }
}
