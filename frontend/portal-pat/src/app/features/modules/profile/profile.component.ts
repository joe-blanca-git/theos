import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { StateUtil } from '../../../core/utils/UserState.util';
import { AuthService } from '../../../core/auth/auth.service';
import { AddressVerifyService } from '../../../core/services/address-verify.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private readonly stateUtil = inject(StateUtil);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly addressVerifyService = inject(AddressVerifyService);

  // Tabs
  activeTab: 'cadastrais' | 'seguranca' = 'cadastrais';

  countries = [
    { code: '+55', name: '+55 (BR)' },
    { code: '+1', name: '+1 (US/CA)' },
    { code: '+351', name: '+351 (PT)' },
    { code: '+54', name: '+54 (AR)' },
    { code: '+56', name: '+56 (CL)' },
    { code: '+57', name: '+57 (CO)' },
    { code: '+51', name: '+51 (PE)' },
    { code: '+52', name: '+52 (MX)' },
    { code: '+34', name: '+34 (ES)' },
    { code: '+33', name: '+33 (FR)' },
    { code: '+39', name: '+39 (IT)' },
    { code: '+44', name: '+44 (UK)' },
    { code: '+49', name: '+49 (DE)' },
    { code: '+81', name: '+81 (JP)' },
    { code: '+86', name: '+86 (CN)' },
    { code: '+91', name: '+91 (IN)' },
    { code: '+61', name: '+61 (AU)' },
    { code: '+7', name: '+7 (RU)' },
    { code: '+27', name: '+27 (ZA)' },
    { code: '+20', name: '+20 (EG)' },
    { code: '+234', name: '+234 (NG)' },
    { code: '+971', name: '+971 (AE)' },
    { code: '+966', name: '+966 (SA)' },
    { code: '+82', name: '+82 (KR)' },
    { code: '+62', name: '+62 (ID)' },
    { code: '+90', name: '+90 (TR)' },
    { code: '+41', name: '+41 (CH)' },
    { code: '+46', name: '+46 (SE)' },
    { code: '+31', name: '+31 (NL)' },
    { code: '+32', name: '+32 (BE)' },
    { code: '+43', name: '+43 (AT)' },
    { code: '+48', name: '+48 (PL)' },
    { code: '+45', name: '+45 (DK)' },
    { code: '+358', name: '+358 (FI)' },
    { code: '+47', name: '+47 (NO)' },
    { code: '+977', name: '+977 (NP)' },
    { code: '+353', name: '+353 (IE)' },
    { code: '+354', name: '+354 (IS)' },
    { code: '+372', name: '+372 (EE)' },
    { code: '+371', name: '+371 (LV)' },
    { code: '+370', name: '+370 (LT)' },
    { code: '+375', name: '+375 (BY)' },
    { code: '+380', name: '+380 (UA)' },
    { code: '+420', name: '+420 (CZ)' },
    { code: '+421', name: '+421 (SK)' },
    { code: '+36', name: '+36 (HU)' },
    { code: '+40', name: '+40 (RO)' },
    { code: '+359', name: '+359 (BG)' },
    { code: '+381', name: '+381 (RS)' },
    { code: '+385', name: '+385 (HR)' },
    { code: '+386', name: '+386 (SI)' },
    { code: '+387', name: '+387 (BA)' },
    { code: '+389', name: '+389 (MK)' },
    { code: '+355', name: '+355 (AL)' },
    { code: '+30', name: '+30 (GR)' },
    { code: '+357', name: '+357 (CY)' },
    { code: '+356', name: '+356 (MT)' },
    { code: '+376', name: '+376 (AD)' },
    { code: '+373', name: '+373 (MD)' },
    { code: '+374', name: '+374 (AM)' },
    { code: '+994', name: '+994 (AZ)' },
    { code: '+995', name: '+995 (GE)' },
    { code: '+996', name: '+996 (KG)' },
    { code: '+992', name: '+992 (TJ)' },
    { code: '+993', name: '+993 (TM)' },
    { code: '+998', name: '+998 (UZ)' },
    { code: '+976', name: '+976 (MN)' }
  ];

  // User details
  userName: string = '';
  userEmail: string = '';
  userRole: string = '';

  // Forms
  personForm!: FormGroup;
  addressForm!: FormGroup;

  // State
  addresses: any[] = [];
  showAddressModal = false;
  isEditingAddress = false;
  currentAddressId: string | null = null;
  isLoading = false;
  
  // Feedback
  showToast = false;
  toastMessage = '';
  toastClass = 'bg-success text-white';

  // Security Form
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  isSubmitting = false;

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  ngOnInit() {
    this.initForms();
    
    this.stateUtil.getUser().subscribe(user => {
      if (user) {
        this.userName = user.name || 'Usuário Não Informado';
        this.userEmail = user.email || '';
        
        if (user.roles && user.roles.length > 0) {
          this.userRole = user.roles[0].value || user.roles[0].name || 'Membro';
        } else {
          this.userRole = 'Membro';
        }

        // Fill Person Form
        this.personForm.patchValue({
          name: this.userName,
          email: this.userEmail,
        });
      }
    });

    this.loadPersonData();
    this.loadAddresses();
  }

  loadPersonData() {
    this.authService.getPerson().subscribe({
      next: (person) => {
        if (person) {
          let phoneVal = person.phone || '';
          let countryCodeVal = '+55';
          if (phoneVal.startsWith('+')) {
            const spaceIdx = phoneVal.indexOf(' ');
            if (spaceIdx > 0) {
              countryCodeVal = phoneVal.substring(0, spaceIdx);
              phoneVal = phoneVal.substring(spaceIdx + 1);
            }
          }
          let formattedDate = '';
          if (person.birthDate) {
            formattedDate = new Date(person.birthDate).toISOString().split('T')[0];
          }
          this.personForm.patchValue({
            name: person.name || this.userName,
            email: person.email || this.userEmail,
            document: person.document || '',
            birthDate: formattedDate,
            phone: phoneVal,
            countryCode: countryCodeVal
          });
          if (person.name) this.userName = person.name;
        }
      },
      error: (err) => console.error('Falha ao buscar dados cadastrais:', err)
    });
  }

  initForms() {
    this.personForm = this.fb.group({
      name: ['', Validators.required],
      birthDate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['+55', Validators.required],
      phone: ['', Validators.required],
      document: ['', Validators.required]
    });

    this.addressForm = this.fb.group({
      description: ['Casa', Validators.required],
      zipCode: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      complement: [''],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required]
    });
  }

  switchTab(tab: 'cadastrais' | 'seguranca') {
    this.activeTab = tab;
  }

  getInitials(name: string): string {
    if (!name || name === 'Usuário Não Informado' || !name.trim()) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }

  triggerToast(message: string, isError = false) {
    this.toastMessage = message;
    this.toastClass = isError ? 'bg-danger text-white' : 'bg-success text-white';
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 4000);
  }

  // --- DADOS CADASTRAIS --- //

  onSubmitPerson() {
    if (this.personForm.invalid) {
      this.triggerToast('Preencha os campos obrigatórios.', true);
      return;
    }

    this.isLoading = true;
    const val = this.personForm.getRawValue();
    
    // Formata a data para ISO se não estiver
    let isoDate = val.birthDate;
    if (isoDate && !isoDate.includes('T')) {
      isoDate = new Date(isoDate).toISOString();
    }

    const payload = {
      name: val.name,
      birthDate: isoDate,
      email: val.email,
      phone: val.countryCode + ' ' + val.phone,
      document: val.document
    };

    this.authService.updatePerson(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.triggerToast('Dados atualizados com sucesso!');
        this.userName = val.name; // Atualiza a UI header
      },
      error: () => {
        this.isLoading = false;
        this.triggerToast('Erro ao atualizar dados.', true);
      }
    });
  }

  // --- ENDEREÇOS --- //

  loadAddresses() {
    this.authService.getMyAddresses().subscribe({
      next: (res) => {
        this.addresses = res || [];
      },
      error: () => {
        console.error('Falha ao buscar endereços');
      }
    });
  }

  onPhoneInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    let formatted = '';
    if (value.length > 0) {
      if (value.length <= 2) {
        formatted = '(' + value;
      } else if (value.length <= 6) {
        formatted = '(' + value.slice(0, 2) + ') ' + value.slice(2);
      } else if (value.length <= 10) {
        formatted = '(' + value.slice(0, 2) + ') ' + value.slice(2, 6) + '-' + value.slice(6);
      } else {
        formatted = '(' + value.slice(0, 2) + ') ' + value.slice(2, 7) + '-' + value.slice(7);
      }
    }
    
    event.target.value = formatted;
    this.personForm.get('phone')?.setValue(formatted, { emitEvent: false });
  }

  openAddressModal(address?: any) {
    if (address) {
      this.isEditingAddress = true;
      this.currentAddressId = address.id;
      this.addressForm.patchValue(address);
    } else {
      this.isEditingAddress = false;
      this.currentAddressId = null;
      this.addressForm.reset({ description: 'Casa' });
    }
    this.showAddressModal = true;
  }

  closeAddressModal() {
    this.showAddressModal = false;
  }

  onCepInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    
    if (value.length > 5) {
      value = value.slice(0, 5) + '-' + value.slice(5);
    }
    
    event.target.value = value;
    this.addressForm.get('zipCode')?.setValue(value, { emitEvent: false });
  }

  onCepChange() {
    const cep = this.addressForm.get('zipCode')?.value?.replace(/\D/g, '');
    if (cep && cep.length === 8) {
      this.addressVerifyService.getZipCode(cep).subscribe({
        next: (res: any) => {
          if (!res.erro) {
            this.addressForm.patchValue({
              street: res.logradouro,
              neighborhood: res.bairro,
              city: res.localidade,
              state: res.uf
            });
          }
        },
        error: () => this.triggerToast('Erro ao buscar CEP', true)
      });
    }
  }

  onSubmitAddress() {
    if (this.addressForm.invalid) {
      this.triggerToast('Preencha todos os campos obrigatórios do endereço.', true);
      return;
    }

    this.isLoading = true;
    const val = this.addressForm.getRawValue();
    const payload = {
      ...val,
      zipCode: val.zipCode?.replace(/\D/g, '')
    };

    if (this.isEditingAddress && this.currentAddressId) {
      this.authService.updateAddress(this.currentAddressId, payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.triggerToast('Endereço atualizado com sucesso!');
          this.closeAddressModal();
          this.loadAddresses();
        },
        error: () => {
          this.isLoading = false;
          this.triggerToast('Erro ao atualizar endereço.', true);
        }
      });
    } else {
      this.authService.addAddress(payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.triggerToast('Endereço adicionado com sucesso!');
          this.closeAddressModal();
          this.loadAddresses();
        },
        error: () => {
          this.isLoading = false;
          this.triggerToast('Erro ao adicionar endereço.', true);
        }
      });
    }
  }

  deleteAddress(id: string) {
    if (confirm('Tem certeza que deseja excluir este endereço?')) {
      this.authService.deleteAddress(id).subscribe({
        next: () => {
          this.triggerToast('Endereço excluído com sucesso!');
          this.loadAddresses();
        },
        error: () => {
          this.triggerToast('Erro ao excluir endereço.', true);
        }
      });
    }
  }

  // --- SEGURANÇA --- //

  onSubmitPassword(event: Event) {
    event.preventDefault();
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.triggerToast('Por favor, preencha todos os campos.', true);
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.triggerToast('As novas senhas não conferem!', true);
      return;
    }

    if (this.newPassword.length < 6) {
      this.triggerToast('A nova senha deve ter no mínimo 6 caracteres.', true);
      return;
    }

    this.isSubmitting = true;
    this.authService.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.triggerToast('Sua senha foi alterada com sucesso!');
      },
      error: () => {
        this.isSubmitting = false;
        this.triggerToast('Erro ao alterar a senha. Verifique sua senha atual.', true);
      }
    });
  }
}
