import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessário para diretivas como *ngFor
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Para usar ngModel
import { ActivatedRoute ,Router } from '@angular/router'; // Para obter parâmetros da rota e navegar
import { GarageService } from '../../services/garageService/garage.service';
import { NotificationService } from '../../services/notification.service';
import { Garage } from '../../models/garage.model'; // Modelo de dados da garagem
import { PropertyTypeService } from '../../services/property-type.service';

@Component({
  selector: 'app-garage-form',
  standalone: true, // É um componente standalone
  imports: [CommonModule, ReactiveFormsModule], // Importe CommonModule e FormsModule
  templateUrl: './garage-form.component.html',
  styleUrls: ['./garage-form.component.css']
})
export class GarageFormComponent implements OnInit {
  garageForm!: FormGroup; // Formulário reativo para a garagem
  isEditMode: boolean = false; // Variável para controlar o modo de edição
  garageId: number | null = null; // Variável para armazenar o ID da garagem
  selectedFile: File | null = null; // Variável para armazenar o arquivo selecionado
  currentImagePreview: string | null = null; // Variável para armazenar a pré-visualização da imagem da garagem
  originalImageUrl: string | null = null;
  imageFileError: string | null = null; // Variável para armazenar erros de arquivo de imagem
  propertyTypes: string[] = [];

  constructor(
    private fb: FormBuilder, // Para construir o formulário reativo
    private garageService: GarageService,
    private route: ActivatedRoute, // Para acessar parâmetros da rota
    public router: Router,
    private notificationService: NotificationService, // Para exibir notificações
    private propertyTypeService: PropertyTypeService
  ) { }

  ngOnInit(): void {
    this.garageForm = this.fb.group({
      id: [0], // Campo oculto para o ID, útil para o modo de edição
      type: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      location: ['', [Validators.required, Validators.maxLength(200)]],
      stateArea: ['', [Validators.required]],
      capacity: [1, [Validators.required, Validators.min(1), Validators.max(1000)]], // Capacidade mínima de 1 e máxima de 1000
      removeExistingImage: [false]
    });

        // Carrega os tipos de propriedade do serviço
    this.propertyTypeService.getPropertyTypes().subscribe(types => {
      this.propertyTypes = types;
    });

    // Verifica se estamos no modo de edição (se há um ID na rota)
    this.route.paramMap.subscribe(params => {
      const id = params.get( 'id');
      if(id){
        this.isEditMode = true;
        this.garageId = +id; // Converte string para número
        this.loadGarage(this.garageId);
      }
    });

    // Monitorar a mudança do checkbox 'removeExistingImage'
    this.garageForm.get('removeExistingImage')?.valueChanges.subscribe(value => {
      if (value) {
        this.selectedFile = null;
        this.currentImagePreview = null;
        const fileInput = document.getElementById('imageFile') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = ''; // Limpa o input file
        }
      } else {
        // Se desmarcado, restaurar a imagem original para preview se não houver nova selecionada
        if (this.originalImageUrl && !this.selectedFile) {
          this.currentImagePreview = this.getBaseUrl() + this.originalImageUrl;
        }
      }
    });
  }

  loadGarage(id: number): void {
    this.garageService.getGarageById(id).subscribe({
      next: (garage: Garage) => {
        this.garageForm.patchValue(garage);
        this.originalImageUrl = garage.imageUrl || null;
        if (this.originalImageUrl) {
          this.currentImagePreview = this.getBaseUrl() + this.originalImageUrl; // Define a imagem atual para pré-visualização
        }
         // Garante que o checkbox 'removeExistingImage' esteja desmarcado ao carregar para edição
        this.garageForm.get('removeExistingImage')?.setValue(false, { emitEvent: false });
      },
      error: (err) => {
        console.error('Erro ao carregar propriedade para edição:', err);
        this.notificationService.error('Não foi possível carregar a propriedade. Verifique o console.');
        this.router.navigate(['/garages']); // Redireciona para a lista de garagens em caso de erro
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.imageFileError = null; // Reseta o erro de arquivo de imagem

      // Validação de tipo de arquivo
      if (!file.type.startsWith('image/')) {
        this.imageFileError = 'Por favor, selecione um arquivo de imagem válido.';
        this.selectedFile = null; // Reseta o arquivo selecionado
        this.currentImagePreview = null; // Reseta a pré-visualização da imagem
        input.value = ''; // Limpa o input para permitir a seleção do mesmo arquivo novamente
        return;
      }

      // Validação de tamanho de arquivo (exemplo: máximo 5MB)
      if (file.size > 5 * 1024 * 1024) { // 5MB
        this.imageFileError = 'O arquivo selecionado é muito grande. O tamanho máximo permitido é 5MB.';
        this.selectedFile = null; // Reseta o arquivo selecionado
        this.currentImagePreview = null; // Reseta a pré-visualização da imagem
        input.value = ''; // Limpa o input para permitir a seleção do mesmo arquivo novamente
        return;
      }
      this.selectedFile = file; // Armazena o arquivo selecionado
      this.garageForm.get('removeExistingImage')?.setValue(false, { emitEvent: false });

      // Cria uma URL para pré-visualização da imagem
      const reader = new FileReader();
      reader.onload = () => {
        this.currentImagePreview = reader.result as string; // Define a pré-visualização da imagem
      };
      reader.readAsDataURL(file); // Lê o arquivo como URL de dados
    } else {
      this.selectedFile = null;
      if (!this.isEditMode || (this.isEditMode && !this.garageForm.get('imageUrl')?.value)) {
        this.currentImagePreview = null; // Reseta a pré-visualização da imagem
      }
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.currentImagePreview = null;
    // Isso é importante: se estiver editando, precisamos informar ao backend para remover a imagem.
    // Usaremos um FormData para isso no onSubmit.
  }

  onSubmit(): void {
    // Verifica se o formulário é válido
    if (this.garageForm.invalid) {
      this.garageForm.markAllAsTouched(); // Marca todos os campos como "touched" para exibir erros de validação
      this.notificationService.warning('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    const formData = new FormData();
    formData.append('Id', this.garageForm.get('id')?.value); // Adiciona o ID da garagem
    formData.append('Type', this.garageForm.get('type')?.value);
    formData.append('Name', this.garageForm.get('name')?.value); // Adiciona o nome da garagem
    formData.append('Location', this.garageForm.get('location')?.value); // Adiciona o endereço da garagem
    formData.append('StateArea', this.garageForm.get('stateArea')?.value);
    formData.append('Capacity', this.garageForm.get('capacity')?.value); // Adiciona a capacidade da garagem

    // Adiciona um arquivo de imagem se estiver selecionado
    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile, this.selectedFile.name); // Adiciona o arquivo de imagem
    } else if (this.isEditMode && !this.currentImagePreview && !this.selectedFile) {
      formData.append('RemoveExistingImage', this.garageForm.get('removeExistingImage')?.value.toString());
    }

    if (this.isEditMode && this.garageId !== null) {
      // Modo Edição
      this.garageService.updateGarageWithFile(this.garageId, formData).subscribe({
        next: () => {
          this.notificationService.success('Propriedade atualizada com sucesso!');
          this.router.navigate(['/garages']); // Volta para a lista de garagens após atualização
        },
        error: (err) => {
          console.error('Erro ao atualizar propriedade:', err);
          let errorMessage = 'Não foi possível atualizar a propriedade.';
          if (err.error && typeof err.error === 'string') {
            errorMessage += `Erro: ${err.error}`; // Se a API retornar uma string
          } else if (err.error && typeof err.errors) {
            // Se a API retornar um objeto de validação (ModelStateDictionary)
            errorMessage += `Verifique os campos: ${Object.values(err.error.errors).flat().join('; ')}`; // Concatena os erros
          }
          this.notificationService.error(errorMessage);
        }
      });
    } else {
      // Modo Criação
      this.garageService.addGarageWithFile(formData).subscribe({
        next: () => {
          this.notificationService.success('Propriedade adicionada com sucesso!');
          this.router.navigate(['/garages']); // Volta para a lista de garagens após criação
        },
        error: (err) => {
          console.error('Erro ao adicionar propriedade:', err);
          let errorMessage = 'Não foi possível adicionar a propriedade.';
          if (err.error && typeof err.error === 'string') {
            errorMessage += `Erro: ${err.error}`; // Se a API retornar uma string
          } else if (err.error && err.error.errors) {
            errorMessage += `Verifique os campos: ${Object.values(err.error.errors).flat().join('; ')}`; // Concatena os erros
          }
          this.notificationService.error(errorMessage);
        }
      });
    }
  }
  // Método para verificar se um campo é inválido e foi tocado
  isFieldInvalid(field: string): boolean | undefined{
    const control = this.garageForm.get(field);
    return control?.invalid && (control?.dirty || control?.touched);
  }

  getBaseUrl(): string {
    return 'https://localhost:7160';
  }
}
