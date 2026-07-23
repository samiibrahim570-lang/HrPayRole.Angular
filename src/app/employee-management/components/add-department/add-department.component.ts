import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateDepartmentRequest } from '../../interface/Department';
import { DepartmentService } from '../../service/department.service';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.css']
})
export class AddDepartmentComponent implements OnInit {

  // 0 = Add mode,  >0 = Edit mode
  @Input() departmentId: number = 0;

  // Emits when user cancels or saves — parent switches back to dashboard
  @Output() formClosed = new EventEmitter<void>();

  deptForm!: FormGroup;
  isLoading  = false;
  isSaving   = false;
  errorMessage  = '';
  successMessage = '';

  get isEditMode(): boolean { return this.departmentId > 0; }

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.isEditMode) {
      this.loadDepartment(this.departmentId);
    }
  }

  initForm(): void {
    this.deptForm = this.fb.group({
      departmentName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      departmentCode: ['', [Validators.maxLength(20)]],
      description:    ['', [Validators.maxLength(500)]],
      isActive:       [true]
    });
  }

  loadDepartment(id: number): void {
    this.isLoading = true;
    this.departmentService.getById(id).subscribe({
      next: (res) => {
        const d = res.result;
        this.deptForm.patchValue({
          departmentName: d.departmentName,
          departmentCode: d.departmentCode || '',
          description:    d.description    || '',
          isActive:       d.isActive
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load department.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.deptForm.invalid) { this.deptForm.markAllAsTouched(); return; }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload: CreateDepartmentRequest = {
      id:             this.departmentId,                           // 0 = create, >0 = update
      departmentName: this.deptForm.value.departmentName.trim(),
      departmentCode: this.deptForm.value.departmentCode?.trim() || undefined,
      description:    this.deptForm.value.description?.trim()    || undefined,
      isActive:       this.deptForm.value.isActive
    };

    this.departmentService.save(payload).subscribe({
      next: () => {
        this.successMessage = this.isEditMode
          ? 'Department updated successfully!'
          : 'Department created successfully!';
        this.isSaving = false;
        setTimeout(() => this.formClosed.emit(), 1200);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Something went wrong. Please try again.';
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    this.formClosed.emit();
  }

  isInvalid(field: string): boolean {
    const ctrl = this.deptForm.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  getError(field: string): string {
    const ctrl = this.deptForm.get(field);
    if (!ctrl?.errors) return '';
    if (ctrl.errors['required'])  return 'This field is required.';
    if (ctrl.errors['minlength']) return `Minimum ${ctrl.errors['minlength'].requiredLength} characters required.`;
    if (ctrl.errors['maxlength']) return `Maximum ${ctrl.errors['maxlength'].requiredLength} characters allowed.`;
    return 'Invalid value.';
  }
}