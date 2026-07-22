import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
export class UserCreateComponent implements OnInit {

  form: FormGroup;

  roles: GetRolesResponse[] = [];
  filteredRoles: GetRolesResponse[] = [];
  rolesLoading = false;
  roleDropdownOpen = false;
  roleSearchTerm = '';

  isEditMode = false;
  globalId: string | null = null;

  loading = false;   // loading existing user for edit
  saving = false;    // submit in progress
  errorMsg = '';

  imagePreview: string | null = null;
  imageError = '';

  // basic guard rails for the uploaded photo
  private readonly MAX_IMAGE_SIZE_MB = 2;
  private readonly ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

  constructor(
    private fb: FormBuilder,
    private userService: UserregistrationService,
    private router: Router,
    private route: ActivatedRoute,
    private elRef: ElementRef
  ) {
    this.form = this.fb.group({
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

  ngOnInit(): void {
    this.loadRoles();

    this.globalId = this.route.snapshot.paramMap.get('globalId');
    this.isEditMode = !!this.globalId;

    if (this.isEditMode) {
      // password not required when editing an existing user
      this.form.get('password')?.clearValidators();
      this.form.get('confirmPassword')?.clearValidators();
      this.loadUser(this.globalId as string);
    } else {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('confirmPassword')?.setValidators([Validators.required]);
    }
    this.form.get('password')?.updateValueAndValidity();
    this.form.get('confirmPassword')?.updateValueAndValidity();
  }

  loadRoles(): void {
    this.rolesLoading = true;
    this.userService.getAllRoles().subscribe({
      // NOTE: assuming `response.data` holds the roles array — adjust if your
      // ResponseModelArray uses a different property name.
      next: (response: any) => {
        this.roles = response?.data ?? [];
        this.filteredRoles = this.roles;
        this.rolesLoading = false;
      },
      error: (err) => {
        console.error('Failed to load roles', err);
        this.rolesLoading = false;
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.roleDropdownOpen && !this.elRef.nativeElement.contains(event.target)) {
      this.roleDropdownOpen = false;
    }
  }

  toggleRoleDropdown(): void {
    if (this.rolesLoading) return;
    this.roleDropdownOpen = !this.roleDropdownOpen;
    if (this.roleDropdownOpen) {
      this.roleSearchTerm = '';
      this.filteredRoles = this.roles;
    }
  }

  filterRoles(): void {
    const term = this.roleSearchTerm.trim().toLowerCase();
    this.filteredRoles = !term
      ? this.roles
      : this.roles.filter(r => r.name.toLowerCase().includes(term));
  }

  selectRole(role: GetRolesResponse): void {
    this.form.patchValue({ roleId: role.id, roleName: role.name });
    this.form.get('roleId')?.markAsTouched();
    this.roleDropdownOpen = false;
  }

  clearRole(event: Event): void {
    event.stopPropagation();
    this.form.patchValue({ roleId: null, roleName: '' });
    this.form.get('roleId')?.markAsTouched();
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

  onImageSelected(event: Event): void {
    this.imageError = '';
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!this.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      this.imageError = 'Please upload a PNG, JPG or WEBP image.';
      return;
    }
    if (file.size > this.MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      this.imageError = `Image must be smaller than ${this.MAX_IMAGE_SIZE_MB}MB.`;
      return;
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
    reader.readAsDataURL(file);
  }

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
      return;
    }

    this.saving = true;
    const value = this.form.getRawValue();

    if (this.isEditMode && this.globalId) {
      const payload: UserRegisterResponse = { ...value, globalId: this.globalId };
      // password fields are not sent on update unless the user actually typed a new one
      if (!payload.password) {
        delete payload.password;
        delete payload.confirmPassword;
      }

      this.userService.updateRegister(this.globalId, payload).subscribe({
        next: () => this.goToListAfterSave(),
        error: (err) => this.handleSaveError(err)
      });
    } else {
      const payload: UserRegister = { ...value };

      this.userService.UserRegister(payload).subscribe({
        next: () => this.goToListAfterSave(),
        error: (err) => this.handleSaveError(err)
      });
    }
  }

  private goToListAfterSave(): void {
    this.saving = false;
    // navigating back to the list triggers its own ngOnInit,
    // which re-calls getAllUsers() and shows the freshly saved user
    this.router.navigate(['/users']);
  }

  private handleSaveError(err: any): void {
    console.error('Failed to save user', err);
    this.errorMsg = this.isEditMode
      ? 'Unable to update user. Please check the form and try again.'
      : 'Unable to create user. Please check the form and try again.';
    this.saving = false;
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}
