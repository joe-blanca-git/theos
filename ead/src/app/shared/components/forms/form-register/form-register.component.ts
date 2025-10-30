import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import {
  LocationsService,
  States,
  Cities,
  Cep,
} from '../../../services/locations.service';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs';

@Component({
  selector: 'app-form-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,

    NzInputModule,
    NzSelectModule,
  ],
  templateUrl: './form-register.component.html',
  styleUrl: './form-register.component.scss',
})
export class FormRegisterComponent {
  formRegister: FormGroup;
  isLoadingStates = false;
  isLoadingCities = false;
  states: States[] = [];
  cities: Cities[] = [];

  constructor(
    private fb: FormBuilder,
    private locationsService: LocationsService
  ) {
    this.formRegister = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      cpf: [null, Validators.required],
      birthday: [null, Validators.required],
      email: [null, Validators.required],
      phone: [null, Validators.required],
      adressZipcode: [null, Validators.required],
      adressCity: [null, Validators.required],
      adressState: [null, Validators.required],
      adressStreet: [null, Validators.required],
      password: [null, Validators.required],
      passwordConfirm: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.formRegister
      .get('adressZipcode')!
      .valueChanges.pipe(
        map((v: string) => (v || '').replace(/\D/g, '')),
        filter((digits: string) => digits.length === 8),
        distinctUntilChanged(),
        debounceTime(300)
      )
      .subscribe((cepDigits: string) => {
        const formatted = cepDigits.replace(/(\d{5})(\d{3})/, '$1-$2');
        this.getCep(formatted);
      });

    this.getStates();
  }

  registerUser(): boolean {
    if (this.formRegister.valid) {
      // faz o registro aqui...
      return true;
    } else {
      this.formRegister.markAllAsTouched();
      this.formRegister.markAsDirty();
      return false;
    }
  }

  async getStates() {
    this.isLoadingStates = true;

    try {
      this.states = await this.locationsService.getStates();
    } finally {
      this.isLoadingStates = false;
    }
  }

  async getCities(uf: string) {
    this.cities = [];
    this.isLoadingCities = true;
    try {
      this.cities = await this.locationsService.getCities(uf);
    } finally {
      this.isLoadingStates = false;
    }
  }

  async getCep(cep: string) {
    this.isLoadingCities = true;
    this.isLoadingStates = true;
    try {
      let result: Cep = {};
      const response: any = await this.locationsService.getCep(cep);

      if (response.erro === 'true') {
        console.error('CEP inválido');
      } else {
        result = response;

        const state = this.states.find((e: States) => e.sigla === result.uf);
        const stateValue = state?.id;
        const statuUf = state?.sigla || '';

        if (stateValue != null) {
          this.formRegister.patchValue(
            { adressState: stateValue },
            { emitEvent: false }
          );

          await this.getCities(statuUf);

          const city = this.cities.find(
            (e: Cities) => String(e.municipio?.id) === result.ibge
          );

          const cityValue = city?.id;
          const streetValue = result.logradouro;

          if (cityValue != null) {
            this.formRegister.patchValue({
              adressCity: cityValue,
            });
          }

          if (result) {
            this.formRegister.patchValue({
              adressStreet: streetValue,
            });
          }
        }
      }
    } finally {
      this.isLoadingStates = false;
      this.isLoadingCities = false;
    }
  }

  onStateChange(stateId: number) {
    const state = this.states.find((s) => s.id === stateId);
    if (state) {
      this.getCities(state.sigla);
    }
  }

  isValidCPF(): number {
    const cpfRaw = this.formRegister.get('cpf')?.value || '';

    if (!cpfRaw) return 0;

    const cpf = cpfRaw.replace(/\D+/g, '');

    if (cpf.length !== 11) return 0;

    if (/^(\d)\1{10}$/.test(cpf)) return 1;

    const calcVerifier = (digits: string, factor: number): number => {
      let total = 0;
      for (let i = 0; i < digits.length; i++) {
        total += parseInt(digits.charAt(i), 10) * (factor - i);
      }
      const remainder = total % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const firstVerifier = calcVerifier(cpf.slice(0, 9), 10);

    if (firstVerifier !== parseInt(cpf.charAt(9), 10)) return 1;

    const secondVerifier = calcVerifier(cpf.slice(0, 10), 11);
    if (secondVerifier !== parseInt(cpf.charAt(10), 10)) return 1;

    return 2;
  }
}
