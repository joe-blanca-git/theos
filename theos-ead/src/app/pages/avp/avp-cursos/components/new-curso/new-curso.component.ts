import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cursoModel } from '../../../models/cursosModel';
import { avpService } from '../../../services/avp.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-new-curso',
  templateUrl: './new-curso.component.html',
  styleUrls: ['./new-curso.component.css'],
})
export class NewCursoComponent {
  @Input('statusModal') isVisible: boolean = false;
  @Output() close = new EventEmitter<boolean>();
  @Output() saveSuccess = new EventEmitter<boolean>();

  listCategorias: any = [
    {
      Id: 1,
      Nome: 'Pregação',
    },
    {
      Id: 2,
      Nome: 'Evangelismo',
    },
    {
      Id: 3,
      Nome: 'Midia',
    },
    {
      Id: 4,
      Nome: 'Missão',
    },
  ];

  newCursoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private avpService: avpService,
    private notification: NotificationService
  ) {
    this.newCursoForm = this.fb.group({
      Titulo: ['', Validators.required],
      Categoria: ['', Validators.required],
      Valor: ['', [Validators.required, Validators.min(0)]],
      DescricaAbreviada: ['', Validators.required],
      DescricaoCompleta: ['', Validators.required],
    });
  }
  saveCurso() {
    const _titulo = this.newCursoForm.get('Titulo')?.value;
    const _categoria = this.newCursoForm.get('Categoria')?.value;
    const _valor = this.newCursoForm.get('Valor')?.value;
    const _descricaoAbreviada = this.newCursoForm.get('DescricaAbreviada')?.value;
    const _descricaoCompleta = this.newCursoForm.get('DescricaoCompleta')?.value;

    const bodyJson: cursoModel = {
      Curso: {
        titulo: _titulo,
        origem: 'Online',
        descricao: _descricaoCompleta,
        descricaoResumida: _descricaoAbreviada,
        categoria: _categoria,
        valor: _valor,
      },
    };

    if (this.newCursoForm.valid) {
      this.avpService.postCursos(bodyJson).subscribe({
        next:(res) => {
          this.notification.createBasicNotification('success', 'bg-success', 'text-light', res.message);
          this.handleOk();
        },error:(err) => {
          this.notification.createBasicNotification('error', 'bg-danger', 'text-light', err.error);
          this.handleCancel();
        },complete: () => {
          console.log('register complete');
        }
      })
    }    
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
    this.saveSuccess.emit(true);
    this.close.emit(false);
    this.newCursoForm.reset();
  }

  handleCancel(): void {
    this.isVisible = false;
    this.close.emit(false);
  }
}
