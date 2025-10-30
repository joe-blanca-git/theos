import { Component } from '@angular/core';
import { avaService } from '../services/ava.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-ava-profile',
  templateUrl: './ava-profile.component.html',
  styleUrls: ['./ava-profile.component.css'],
})
export class AvaProfileComponent {
  profileForm: FormGroup;

  profile: any[] = [];
  listEstados: any[] = [];
  listCidades: any[] = [];
  selectedEstado = '';
  loading = false;
  loadingInput = false;

  constructor(
    private avaService: avaService,
    private fb: FormBuilder,
    private notification: NotificationService
  ) {
    this.profileForm = this.fb.group({
      nomeCompleto: ['', Validators.required],
      enderecoRua: ['', Validators.required],
      enderecoNumero: ['', Validators.required],
      enderecoBairro: ['', Validators.required],
      enderecoEstado: ['', Validators.required],
      enderecoCidade: ['', Validators.required],
      contato: ['', Validators.required],
      email: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadDados();
  }

  saveProfile(){

    if (this.profileForm.valid) {
      const bodyJson: any = {
        Profile: this.profileForm.value 
      };
      
      this.avaService.putProfile(bodyJson).subscribe({
        next:(res) => {
          this.notification.createBasicNotification('success', 'bg-success', 'text-light', res.message);
        },error:(err) => {
          this.notification.createBasicNotification('error', 'bg-danger', 'text-light', err.error);
        },complete: () => {
          this.getProfile();
        }
      })
    }else{
      this.notification.createBasicNotification(
        'error',
        'bg-danger',
        'text-light',
        'Preencha todas as informações para salvar!'
      );
    }
  }

  async loadDados() {
    this.loading = true;
    try {
      await this.getEstados();
      await this.getProfile();
    } catch (error) {
      this.notification.createBasicNotification(
        'error',
        'bg-danger',
        'text-light',
        String(error)
      );
    } finally {
      this.loading = false;
    }
  }

  getEstados() {
    this.avaService
      .getEstados()
      .then((data: { nome: string }[]) => {
        const estadosOrdenados = data.sort(
          (a: { nome: string }, b: { nome: string }) =>
            a.nome.localeCompare(b.nome)
        );
        console.log('Estados recebidos: ', estadosOrdenados);
        this.listEstados = estadosOrdenados;
      })
      .catch((error) => {
        this.notification.createBasicNotification(
          'error',
          'bg-danger',
          'text-light',
          error.message
        );
      });
  }

  async getCidades(): Promise<void> {
    this.loadingInput = true;

    try {
      if (this.selectedEstado) {
        const data = await this.avaService.getCidades(this.selectedEstado);
        this.listCidades = data;
      }
    } catch (error) {
      this.notification.createBasicNotification(
        'error',
        'bg-danger',
        'text-light',
        String(error)
      );
    } finally {
      this.loadingInput = false;
    }
  }

  getProfile() {
    this.avaService
      .getProfile()
      .then((data) => {
        console.log('Dados recebidos: ', data);
        this.profile = data;

        if (this.profile.length > 0) {
          this.profileForm.patchValue({
            nomeCompleto: this.profile[0].Nome || '',
            enderecoRua: this.profile[0].Rua || '',
            enderecoNumero: this.profile[0].Numero || '',
            enderecoBairro: this.profile[0].Bairro || '',
            enderecoCidade: this.profile[0].Cidade || '',
            contato: this.profile[0].Contato || '',
            email: this.profile[0].Email || '',
          });
          this.selectedEstado = this.profile[0].Estado;
        }
      })
      .catch((error) => {
        this.notification.createBasicNotification(
          'error',
          'bg-danger',
          'text-light',
          error.message
        );
      });
  }

  onDropdownOpen(opened: boolean): void {
    this.loadingInput = true;

    try {
      if (opened && this.listCidades.length === 0) {
        this.getCidades();
      }
    } catch (error) {
      this.notification.createBasicNotification(
        'error',
        'bg-danger',
        'text-light',
        String(error)
      );
    }
  }

  selectEstado(value: string) {
    this.selectedEstado = value;

    if (this.selectedEstado) {
      this.getCidades();
    } else {
      this.listCidades = [];
      this.profileForm.patchValue({ enderecoCidade: null });
    }
  }

  formatarParaBRL(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }
}
