import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationService } from '../../../../../shared/services/notification.service';

export interface IModule {
  Modulo: {
    Name: string;
    Description: string;
    Teacher: number;
    Img: string;
  };
}

@Component({
  selector: 'app-form-module',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form-module.component.html',
  styleUrl: './form-module.component.scss',
})
export class FormModuleComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Input('listTeachers') listTeachers: any[] = [];
  @Output() bodyModule = new EventEmitter<IModule>();

  formModule!: FormGroup;
  imgModule: string | ArrayBuffer | null = null;
  imageError: string | null = null;
  isDragging = false;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.formModule = new FormGroup({
      Name: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      Description: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      PeopleTeacherId: new FormControl(null, [Validators.required]),
      Image: new FormControl(null, [Validators.required]),
    });
  }

  addModule() {
    if (this.outPutData()) {
      const bodyModule: IModule = {
        Modulo: {
          Name: this.formModule.get('Name')?.value,
          Description: this.formModule.get('Description')?.value,
          Teacher: this.formModule.get('PeopleTeacherId')?.value,
          Img: this.formModule.get('Image')?.value,
        },
      };

      this.bodyModule.emit(bodyModule);
      this.formModule.reset();
      this.clearImage();
    }
  }

  outPutData() {
    if (this.formModule.valid) {
      return this.formModule.value;
    } else {
      Object.keys(this.formModule.controls).forEach((campo) => {
        const control = this.formModule.get(campo);

        if (control && control.invalid) {
          console.log(`Campo inválido: ${campo}, Erros:`, control.errors);
        }
      });

      this.formModule.markAllAsTouched();
      this.notificationService.show(
        'warning',
        'Atenção!',
        'Preencha todos os campos corretamente para prosseguir.',
        5000
      );

      return null;
    }
  }

  clearImage(): void {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }

    this.imgModule = null;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  private processFile(file: File) {
    this.imageError = null;
    this.imgModule = null;

    if (!file.type.startsWith('image/')) {
      this.imageError = 'O arquivo selecionado não é uma imagem.';
      this.formModule.patchValue({ Image: null });
      return;
    }

    const reader = new FileReader();
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      const width = image.width;
      const height = image.height;
      const aspectRatio = width / height;
      const targetRatio = 16 / 9;
      const tolerance = 0.05;

      URL.revokeObjectURL(objectUrl);

      if (width > 1280 || height > 720) {
        this.imageError = `Dimensões excedidas (${width}x${height}). Máximo: 1280x720.`;
        this.formModule.patchValue({ Image: null });
        return;
      }

      if (Math.abs(aspectRatio - targetRatio) > tolerance) {
        this.imageError =
          'A proporção da imagem deve ser 16:9 (miniatura do YouTube).';
        this.formModule.patchValue({ Image: null });
        return;
      }

      reader.readAsDataURL(file);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      this.imageError = 'Não foi possível carregar a imagem para validação.';
    };

    reader.onload = () => {
      this.imgModule = reader.result;
      this.formModule.patchValue({ Image: this.imgModule });
      this.formModule.get('Image')?.updateValueAndValidity();
    };

    image.src = objectUrl;
  }
}
