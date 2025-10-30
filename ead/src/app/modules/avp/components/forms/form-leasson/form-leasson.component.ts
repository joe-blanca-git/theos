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
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationService } from '../../../../../shared/services/notification.service';
import { VideoService } from '../../../services/video.service';
import { IModule } from '../form-module/form-module.component';

@Component({
  selector: 'app-form-leasson',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form-leasson.component.html',
  styleUrl: './form-leasson.component.scss',
})
export class FormLeassonComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @Output() bodyLesson = new EventEmitter<IModule>();
  @Input('listModules') listModules: any[]=[];

  formLesson!: FormGroup;
  isDraggingOver = false;
  selectedFile: File | null = null;
  videoDuration: string | null = null;

  constructor(
    private fb: FormBuilder,
    private videoService: VideoService,
    private notificationService: NotificationService
  ) {
    this.formLesson = this.fb.group({
      Name: ['', Validators.required],
      DescriptionLarge: ['', Validators.required],
      DescriptionSmall: ['', Validators.required],
      ModuleId: ['', Validators.required],
      VideoBin: [null, Validators.required],
    });
  }

  addLesson() {
    if (this.outPutData()) {
      const lessonBody: any = {
        Lesson: {
          Name: this.formLesson.get('Name')?.value,
          DescriptionLarge: this.formLesson.get('DescriptionLarge')?.value,
          DescriptionSmall: this.formLesson.get('DescriptionSmall')?.value,
          DurationSeconds: this.videoDuration,
          VideoBin: this.formLesson.get('VideoBin')?.value,
          ModuleId: this.formLesson.get('ModuleId')?.value
        },
      };

      this.bodyLesson.emit(lessonBody);
      this.resetForm();
    }
  }

  outPutData() {
    if (this.formLesson.valid) {
      return this.formLesson.value;
    }

    this.formLesson.markAllAsTouched();
    this.notificationService.show(
      'warning',
      'Atenção!',
      'Preencha todos os campos corretamente para prosseguir.',
      5000
    );

    return null;
  }

  openFilePicker(): void {
    if (!this.selectedFile) {
      this.fileInput.nativeElement.click();
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingOver = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) this.processVideoFile(file);
  }

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) this.processVideoFile(file);
  }

  removeFile(event: MouseEvent): void {
    event.stopPropagation();
    this.selectedFile = null;
    this.videoDuration = null;
    this.formLesson.get('VideoBin')?.reset();
    this.fileInput.nativeElement.value = '';
  }

  // 🧠 Processa o arquivo selecionado ou solto
  private processVideoFile(file: File): void {
    if (!file.type.startsWith('video/')) {
      this.notificationService.show(
        'warning',
        'Formato inválido',
        'Por favor, selecione apenas arquivos de vídeo.',
        4000
      );
      return;
    }

    this.selectedFile = file;
    this.videoDuration = 'Carregando...';

    this.videoService.getVideoDuration(file).subscribe({
      next: (durationInSeconds) => {
        this.videoDuration = this.formatDuration(durationInSeconds);
      },
      error: () => {
        this.videoDuration = 'Não foi possível ler a duração.';
      },
    });

    const formData = new FormData();
    formData.append('video', file);
    this.formLesson.patchValue({ VideoBin: formData });
  }

  private formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  private resetForm(): void {
    this.formLesson.reset();
    this.selectedFile = null;
    this.videoDuration = null;
    this.fileInput.nativeElement.value = '';
  }
}
