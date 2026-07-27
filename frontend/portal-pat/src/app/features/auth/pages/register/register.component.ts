import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted: boolean = false;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  isCheckingEmail = false;
  
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
    { code: '+64', name: '+64 (NZ)' },
    { code: '+65', name: '+65 (SG)' },
    { code: '+60', name: '+60 (MY)' },
    { code: '+63', name: '+63 (PH)' },
    { code: '+66', name: '+66 (TH)' },
    { code: '+84', name: '+84 (VN)' },
    { code: '+92', name: '+92 (PK)' },
    { code: '+880', name: '+880 (BD)' },
    { code: '+98', name: '+98 (IR)' },
    { code: '+964', name: '+964 (IQ)' },
    { code: '+972', name: '+972 (IL)' },
    { code: '+598', name: '+598 (UY)' },
    { code: '+595', name: '+595 (PY)' },
    { code: '+591', name: '+591 (BO)' },
    { code: '+593', name: '+593 (EC)' },
    { code: '+58', name: '+58 (VE)' },
    { code: '+502', name: '+502 (GT)' },
    { code: '+504', name: '+504 (HN)' },
    { code: '+503', name: '+503 (SV)' },
    { code: '+506', name: '+506 (CR)' },
    { code: '+507', name: '+507 (PA)' },
    { code: '+53', name: '+53 (CU)' },
    { code: '+509', name: '+509 (HT)' },
    { code: '+212', name: '+212 (MA)' },
    { code: '+213', name: '+213 (DZ)' },
    { code: '+216', name: '+216 (TN)' },
    { code: '+254', name: '+254 (KE)' },
    { code: '+255', name: '+255 (TZ)' },
    { code: '+256', name: '+256 (UG)' },
    { code: '+233', name: '+233 (GH)' },
    { code: '+225', name: '+225 (CI)' },
    { code: '+221', name: '+221 (SN)' },
    { code: '+244', name: '+244 (AO)' },
    { code: '+258', name: '+258 (MZ)' },
    { code: '+260', name: '+260 (ZM)' },
    { code: '+263', name: '+263 (ZW)' },
    { code: '+93', name: '+93 (AF)' },
    { code: '+94', name: '+94 (LK)' },
    { code: '+95', name: '+95 (MM)' },
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
    { code: '+976', name: '+976 (MN)' },
  ];

  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      countryCode: ['+55', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email], [this.emailValidator()]],
      password: ['', [
        Validators.required, 
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._\-#^()*+=\[\]{}|\\:<>,?~/`~]).{6,}$/)
      ]],
      confirmPassword: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
    }, {
      validators: this.passwordMatchValidator
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
    this.registerForm.get('phone')?.setValue(formatted, { emitEvent: false });
  }

  // Validador customizado para verificar disponibilidade do e-mail
  emailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      
      this.isCheckingEmail = true;
      return timer(500).pipe(
        switchMap(() => this.authService.checkEmail(control.value)),
        map((res: any) => {
          this.isCheckingEmail = false;
          // Se a API retornar indícios de que o e-mail está em uso
          if (res === true || res?.exists || res?.inUse) {
            return { emailTaken: true };
          }
          return null; // OK
        }),
        catchError((err) => {
          this.isCheckingEmail = false;
          if (err?.error?.message?.toLowerCase().includes('já existe') || err?.error?.message?.toLowerCase().includes('already exists')) {
             return of({ emailTaken: true });
          }
          return of(null);
        })
      );
    };
  }

  // Validador customizado para verificar se as senhas coincidem
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formVal = this.registerForm.getRawValue();
    this.registerForm.disable();

    let isoBirthDate = formVal.birthDate;
    if (isoBirthDate) {
      try {
        isoBirthDate = new Date(isoBirthDate).toISOString();
      } catch (e) {
        console.error(e);
      }
    }

    const payload = {
      idSystem: 2,
      name: formVal.name,
      email: formVal.email,
      password: formVal.password,
      birthDate: isoBirthDate,
      phone: formVal.countryCode + ' ' + formVal.phone
    };

    this.authService.registerSystemUser(payload).subscribe({
      next: () => {
         this.toastService.success('Cadastro realizado com sucesso!', 5000);
         this.router.navigate(['/auth/login']);
      },
      error: (err) => {
         // O interceptor de erro já exibe o toast com a mensagem,
         // então apenas removemos o loading state.
         this.isLoading = false;
         this.registerForm.enable();
      }
    });
  }
}
