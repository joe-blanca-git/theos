import { Component, OnInit, inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { BreadcrumbComponent } from '../../../../../shared/components/breadcrumb/breadcrumb.component';

declare var bootstrap: any;

@Component({
  selector: 'app-settings-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BreadcrumbComponent],
  templateUrl: './settings-home.component.html',
  styleUrl: './settings-home.component.scss'
})
export class SettingsHomeComponent implements OnInit {
  private settingsService = inject(SettingsService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject(ToastService);

  activeTab: 'categories' | 'teachers' = 'categories';
  isLoading = false;

  categories: any[] = [];
  teachers: any[] = [];
  systemUsers: any[] = [];
  avatarPreview: string | null = null;

  categoryForm!: FormGroup;
  teacherForm!: FormGroup;

  categoryToEdit: any | null = null;
  categoryToDelete: any | null = null;

  teacherToEdit: any | null = null;
  teacherToDelete: any | null = null;

  isSubmittingCategory = false;
  isDeletingCategory = false;

  isSubmittingTeacher = false;
  isDeletingTeacher = false;

  @ViewChild('categoryModal') categoryModalRef!: ElementRef;
  @ViewChild('confirmDeleteCategoryModal') confirmDeleteCategoryModalRef!: ElementRef;
  @ViewChild('teacherModal') teacherModalRef!: ElementRef;
  @ViewChild('confirmDeleteTeacherModal') confirmDeleteTeacherModalRef!: ElementRef;

  private categoryModalInstance: any;
  private confirmDeleteCategoryModalInstance: any;
  private teacherModalInstance: any;
  private confirmDeleteTeacherModalInstance: any;

  ngOnInit(): void {
    this.initForms();
    this.loadData();
    this.loadSystemUsers();
  }

  ngAfterViewInit() {
    this.categoryModalInstance = new bootstrap.Modal(this.categoryModalRef.nativeElement);
    this.confirmDeleteCategoryModalInstance = new bootstrap.Modal(this.confirmDeleteCategoryModalRef.nativeElement);
    this.teacherModalInstance = new bootstrap.Modal(this.teacherModalRef.nativeElement);
    this.confirmDeleteTeacherModalInstance = new bootstrap.Modal(this.confirmDeleteTeacherModalRef.nativeElement);
  }

  initForms() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });

    this.teacherForm = this.fb.group({
      name: ['', Validators.required],
      role: [''],
      position: [''],
      avatar: [''],
      bio: [''],
      instagramLink: [''],
      linkedinLink: [''],
      idAgivys: ['']
    });
  }

  switchTab(tab: 'categories' | 'teachers') {
    this.activeTab = tab;
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    if (this.activeTab === 'categories') {
      this.settingsService.getCategories().subscribe({
        next: (data) => {
          this.categories = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading categories', err);
          this.toastService.error('Erro ao carregar categorias.');
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.settingsService.getTeachers().subscribe({
        next: (data) => {
          this.teachers = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading teachers', err);
          this.toastService.error('Erro ao carregar professores.');
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  loadSystemUsers() {
    this.settingsService.getSystemUsers().subscribe({
      next: (users) => {
        this.systemUsers = users;
      },
      error: (err) => {
        console.error('Error loading system users', err);
      }
    });
  }

  // --- Category Methods ---

  openAddCategoryModal() {
    this.categoryToEdit = null;
    this.categoryForm.reset();
    this.categoryModalInstance.show();
  }

  openEditCategoryModal(category: any) {
    this.categoryToEdit = category;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description
    });
    this.categoryModalInstance.show();
  }

  saveCategory() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.isSubmittingCategory = true;
    const payload = this.categoryForm.value;

    if (this.categoryToEdit) {
      payload.id = this.categoryToEdit.id;
      this.settingsService.updateCategory(this.categoryToEdit.id, payload).subscribe({
        next: () => {
          this.toastService.success('Categoria atualizada com sucesso!');
          this.isSubmittingCategory = false;
          this.categoryModalInstance.hide();
          this.loadData();
        },
        error: (err) => {
          console.error('Error updating category', err);
          this.toastService.error('Erro ao atualizar categoria.');
          this.isSubmittingCategory = false;
        }
      });
    } else {
      this.settingsService.createCategory(payload).subscribe({
        next: () => {
          this.toastService.success('Categoria criada com sucesso!');
          this.isSubmittingCategory = false;
          this.categoryModalInstance.hide();
          this.loadData();
        },
        error: (err) => {
          console.error('Error creating category', err);
          this.toastService.error('Erro ao criar categoria.');
          this.isSubmittingCategory = false;
        }
      });
    }
  }

  confirmDeleteCategory(category: any) {
    this.categoryToDelete = category;
    this.confirmDeleteCategoryModalInstance.show();
  }

  executeDeleteCategory() {
    if (!this.categoryToDelete) return;

    this.isDeletingCategory = true;
    this.settingsService.deleteCategory(this.categoryToDelete.id).subscribe({
      next: () => {
        this.toastService.success('Categoria excluída com sucesso!');
        this.isDeletingCategory = false;
        this.confirmDeleteCategoryModalInstance.hide();
        this.categoryToDelete = null;
        this.loadData();
      },
      error: (err) => {
        console.error('Error deleting category', err);
        this.toastService.error('Erro ao excluir categoria.');
        this.isDeletingCategory = false;
      }
    });
  }

  // --- Teacher Methods ---

  openAddTeacherModal() {
    this.teacherToEdit = null;
    this.avatarPreview = null;
    this.teacherForm.reset();
    this.teacherModalInstance.show();
  }

  openEditTeacherModal(teacher: any) {
    this.teacherToEdit = teacher;
    this.teacherForm.patchValue({
      name: teacher.name,
      role: teacher.role,
      position: teacher.position,
      avatar: teacher.avatar,
      bio: teacher.bio,
      instagramLink: teacher.instagramLink,
      linkedinLink: teacher.linkedinLink,
      idAgivys: teacher.idAgivys
    });
    this.avatarPreview = teacher.avatar || null;
    this.teacherModalInstance.show();
  }

  saveTeacher() {
    if (this.teacherForm.invalid) {
      this.teacherForm.markAllAsTouched();
      return;
    }

    this.isSubmittingTeacher = true;
    const payload = this.teacherForm.value;

    if (this.teacherToEdit) {
      payload.id = this.teacherToEdit.id;
      this.settingsService.updateTeacher(this.teacherToEdit.id, payload).subscribe({
        next: () => {
          this.toastService.success('Professor atualizado com sucesso!');
          this.isSubmittingTeacher = false;
          this.teacherModalInstance.hide();
          this.loadData();
        },
        error: (err) => {
          console.error('Error updating teacher', err);
          this.toastService.error('Erro ao atualizar professor.');
          this.isSubmittingTeacher = false;
        }
      });
    } else {
      this.settingsService.createTeacher(payload).subscribe({
        next: () => {
          this.toastService.success('Professor criado com sucesso!');
          this.isSubmittingTeacher = false;
          this.teacherModalInstance.hide();
          this.loadData();
        },
        error: (err) => {
          console.error('Error creating teacher', err);
          this.toastService.error('Erro ao criar professor.');
          this.isSubmittingTeacher = false;
        }
      });
    }
  }

  onUserSelect(event: any) {
    const selectedExternalId = event.target.value;
    this.teacherForm.patchValue({ idAgivys: selectedExternalId });
  }

  onAvatarSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB
        this.toastService.error('A imagem deve ter no máximo 1MB.');
        event.target.value = ''; // Reset file input
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string;
        this.teacherForm.patchValue({ avatar: this.avatarPreview });
        this.teacherForm.get('avatar')?.markAsDirty();
      };
      reader.readAsDataURL(file);
    }
  }

  confirmDeleteTeacher(teacher: any) {
    this.teacherToDelete = teacher;
    this.confirmDeleteTeacherModalInstance.show();
  }

  executeDeleteTeacher() {
    if (!this.teacherToDelete) return;

    this.isDeletingTeacher = true;
    this.settingsService.deleteTeacher(this.teacherToDelete.id).subscribe({
      next: () => {
        this.toastService.success('Professor inativado com sucesso!');
        this.isDeletingTeacher = false;
        this.confirmDeleteTeacherModalInstance.hide();
        this.teacherToDelete = null;
        this.loadData();
      },
      error: (err) => {
        console.error('Error deleting teacher', err);
        this.toastService.error('Erro ao inativar professor.');
        this.isDeletingTeacher = false;
      }
    });
  }
}
