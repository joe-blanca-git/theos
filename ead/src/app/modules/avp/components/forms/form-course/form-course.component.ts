import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationService } from '../../../../../shared/services/notification.service';
import { CommonModule } from '@angular/common';
import { CourseCategoryModel, CourseModel } from '../../../models/avp.models';

@Component({
  selector: 'app-form-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form-course.component.html',
  styleUrl: './form-course.component.scss',
})
export class FormCourseComponent {
  @Input('listCourseCategories') listCourseCategories: CourseCategoryModel[] =
    [];

  formCourse!: FormGroup;
  imgModule: string | ArrayBuffer | null = null;
  imageError: string | null = null;
  isDragging = false;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.formCourse = new FormGroup({
      Name: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      CategoryId: new FormControl(null, [Validators.required]),
      Price: new FormControl(null, [Validators.required, Validators.min(0)]),
      DescriptionSmall: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      DescriptionLarge: new FormControl('', [
        Validators.required,
        Validators.maxLength(500),
      ]),
      Image: new FormControl('', Validators.required),
      CodeCourse: new FormControl(''),
    });
  }

  outPutData() {
    if (this.formCourse.valid) {
      return this.formCourse.value;
    } else {
      Object.keys(this.formCourse.controls).forEach((campo) => {
        const control = this.formCourse.get(campo);

        if (control && control.invalid) {
          console.log(`Campo inválido: ${campo}, Erros:`, control.errors);
        }
      });

      this.formCourse.markAllAsTouched();
      this.notificationService.show(
        'warning',
        'Atenção!',
        'Preencha todos os campos corretamente para prosseguir.',
        5000
      );

      return null;
    }
  }

  inPutData(data: CourseModel) {
    
    console.log(data);
    
    this.formCourse.patchValue({
      Name: data.Title,
      CategoryId: data.CodeCategory,
      Price: data.Price,
      DescriptionSmall: data.DescriptionShort,
      DescriptionLarge: data.DescriptionLarge,
      Image: data.Poster,
      CodeCourse: data.CodeCourse,
    });

    if (data.Poster) {
      this.imgModule = data.Poster;
    }
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
      this.formCourse.patchValue({ Image: null });
      return;
    }

    const reader = new FileReader();
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      const width = image.width;
      const height = image.height;
      const aspectRatio = width / height;

      const targetRatio = 2 / 3;
      const tolerance = 0.05;

      URL.revokeObjectURL(objectUrl);

      if (width > 480 || height > 720) {
        this.imageError = `Dimensões excedidas (${width}x${height}). Máximo: 480x720.`;
        this.formCourse.patchValue({ Image: null });
        return;
      }

      if (Math.abs(aspectRatio - targetRatio) > tolerance) {
        this.imageError =
          'A proporção da imagem deve ser 2:3 (retrato 480x720).';
        this.formCourse.patchValue({ Image: null });
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
      this.formCourse.patchValue({ Image: this.imgModule });
      this.formCourse.get('Image')?.updateValueAndValidity();
    };

    image.src = objectUrl;
  }
}
