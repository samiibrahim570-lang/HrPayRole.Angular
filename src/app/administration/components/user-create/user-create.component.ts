import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { GetRolesResponse } from '../../interfaces/GetRolesResponse';
import { UserregistrationService } from '../../sservices/userregistration.service';
import { UserRegisterResponse, UserRegister } from '../../interfaces/pagesWithControl';

// Validator: confirmPassword must match password (only enforced in create mode)
function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  if (!password && !confirmPassword) return null;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit, OnChanges {
  @Input() editGlobalId: string | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form: FormGroup;
  rolesList: GetRolesResponse[] = [];
  rolesLoading = false;

  isEditMode = false;
  loading = false;
  saving = false;
  errorMsg = '';
  imagePreview: string | null = null;
  imageError = '';

  private readonly MAX_IMAGE_SIZE_MB = 2;
  private readonly ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

  constructor(
    private fb: FormBuilder,
    private userService: UserregistrationService
  ) {
    this.form = this.buildForm();
  }

  ngOnInit(): void {
    this.loadRoles();
    this.setupForMode();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editGlobalId'] && !changes['editGlobalId'].firstChange) {
      this.setupForMode();
    }
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      confirmPassword: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]{7,15}$/)]],
      whatsAppNumber: ['', [Validators.pattern(/^[0-9+\-\s]{0,15}$/)]],
      phoneNumber: ['', [Validators.pattern(/^[0-9+\-\s]{0,15}$/)]],
      address: ['', Validators.required],
      roleId: [null, Validators.required],
      roleName: [''],
      image: [''],
      isActive: [true],
    }, { validators: passwordsMatchValidator });
  }

  private setupForMode(): void {
    this.errorMsg = '';
    this.imagePreview = null;
    this.imageError = '';
    this.form = this.buildForm();

    this.isEditMode = !!this.editGlobalId;

    if (this.isEditMode) {
      this.form.get('password')?.clearValidators();
      this.form.get('confirmPassword')?.clearValidators();
      this.loadUser(this.editGlobalId as string);
    } else {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('confirmPassword')?.setValidators([Validators.required]);
    }
    this.form.get('password')?.updateValueAndValidity();
    this.form.get('confirmPassword')?.updateValueAndValidity();
  }

  private loadRoles(): void {
    this.rolesLoading = true;
    this.userService.getAllRoles().subscribe({
      next: (res: any) => {
        this.rolesList = res.result || [];
        this.rolesLoading = false;
      },
      error: () => {
        this.rolesLoading = false;
      }
    });
  }

  loadUser(globalId: string): void {
    this.loading = true;
    this.userService.getByGlobalIdApplicationUser(globalId).subscribe({
      next: (response: any) => {
        const user: UserRegisterResponse = response?.data;
        if (user) {
          this.form.patchValue({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            contactNumber: user.contactNumber,
            whatsAppNumber: user.whatsAppNumber,
            phoneNumber: user.phoneNumber,
            address: user.address,
            roleId: user.roleId,
            roleName: user.roleName,
            image: user.image,
            isActive: user.isActive,
          });
          this.imagePreview = user.image || null;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load user', err);
        this.errorMsg = 'Unable to load this user.';
        this.loading = false;
      }
    });
  }

  /**
   * Hooked into nz-upload's nzBeforeUpload. Returning false prevents
   * ng-zorro from auto-uploading the file to a remote endpoint — we just
   * want to validate it and read it into the form as base64.
   */
  beforeUpload = (file: NzUploadFile): boolean => {
    this.imageError = '';
    const rawFile = file as unknown as File;

    if (!this.ALLOWED_IMAGE_TYPES.includes(rawFile.type)) {
      this.imageError = 'Please upload a PNG, JPG or WEBP image.';
      return false;
    }
    if (rawFile.size > this.MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      this.imageError = `Image must be smaller than ${this.MAX_IMAGE_SIZE_MB}MB.`;
      return false;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string; // e.g. data:image/png;base64,....
      this.form.patchValue({ image: base64 });
      this.imagePreview = base64;
    };
    reader.onerror = () => {
      this.imageError = 'Could not read the selected image. Please try again.';
    };
    reader.readAsDataURL(rawFile);

    return false;
  };

  removeImage(): void {
    this.form.patchValue({ image: '' });
    this.imagePreview = null;
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    this.errorMsg = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Object.values(this.form.controls).forEach(control => {
        control.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    this.saving = true;
    const value = this.form.getRawValue();

    if (this.isEditMode && this.editGlobalId) {
      const payload: UserRegisterResponse = { ...value, globalId: this.editGlobalId };
      // password fields are not sent on update unless the user actually typed a new one
      if (!payload.password) {
        delete payload.password;
        delete payload.confirmPassword;
      }

      this.userService.updateRegister(this.editGlobalId, payload).subscribe({
        next: () => this.finishSave(),
        error: (err) => this.handleSaveError(err)
      });
    } else {
      const payload: UserRegister = { ...value };

      this.userService.UserRegister(payload).subscribe({
        next: () => this.finishSave(),
        error: (err) => this.handleSaveError(err)
      });
    }
  }

  private finishSave(): void {
    this.saving = false;
    this.saved.emit();
  }

  private handleSaveError(err: any): void {
    console.error('Failed to save user', err);
    this.errorMsg = this.isEditMode
      ? 'Unable to update user. Please check the form and try again.'
      : 'Unable to create user. Please check the form and try again.';
    this.saving = false;
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
