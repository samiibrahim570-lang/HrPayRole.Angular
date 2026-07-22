// assign-permissions.component.ts
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageResponse, RolePagePermissionResponse, RoleWithUsersResponse } from '../../interfaces/pagesWithControl';
import { PermissionService } from '../../sservices/permission.service';

interface RolePagePermissionBox {
  isView: boolean;
  isAdd: boolean;
  isEdit: boolean;
  isDelete: boolean;
}

interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info';
  text: string;
}

@Component({
  selector: 'app-assign-permissions',
  templateUrl: './assign-permissions.component.html',
  styleUrls: ['./assign-permissions.component.scss']
})
export class AssignPermissionsComponent implements OnInit {

  // ----- Tabs -----
  mainTabs = [1, 2];
  activeTab = 0;

  // ----- Loading / state flags -----
  isLoadingPages = false;
  isLoadingUsers = false;
  isSaving = false;
  isFormChanged = false;
  editMode = false;

  // ----- Data -----
  pagesResponse: PageResponse[] = [];
  permissionsMap: Map<number, RolePagePermissionBox[]> = new Map();
  userList: RoleWithUsersResponse[] = [];
  selectedUser?: RoleWithUsersResponse;
  globalId: string | null = null;

  // ----- "Control all" column checkboxes -----
  checkedView = false;
  checkedAdd = false;
  checkedEdit = false;
  checkedDelete = false;
  indeterminateView = false;
  indeterminateAdd = false;
  indeterminateEdit = false;
  indeterminateDelete = false;

  // ----- Search -----
  moduleSearchTerm = '';
  roleSearchTerm = '';

  // ----- Toasts (replaces window.alert) -----
  toasts: ToastMessage[] = [];
  private toastCounter = 0;

  roleForm: FormGroup;

  constructor(
    private _pageService: PermissionService,
    private _userRegistrationService: PermissionService,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.roleForm = this.fb.group({
      roleName: ['', [Validators.required, Validators.maxLength(75)]]
    });
  }

  ngOnInit(): void {
    this.getAllPagesWithControlOrPermissions();
    this.getApplicationUser();

    this.roleForm.valueChanges.subscribe(() => {
      this.isFormChanged = true;
    });
  }

  // ============================================================
  // Role name form controls
  // ============================================================
  get roleNameControl() {
    return this.roleForm.get('roleName');
  }

  get roleName() {
    return this.roleNameControl?.value || '';
  }

  get roleNameError(): boolean {
    return !!(this.roleNameControl?.invalid && this.roleNameControl?.touched);
  }

  get roleNameErrorMessage(): string {
    if (this.roleNameControl?.hasError('required')) {
      return 'Role name is required.';
    }
    if (this.roleNameControl?.hasError('maxlength')) {
      const excess = (this.roleNameControl?.value?.length || 0) - 75;
      return `${excess} character${excess > 1 ? 's' : ''} over the 75 character limit.`;
    }
    if (this.roleNameControl?.hasError('duplicate')) {
      return 'A role with the same name already exists.';
    }
    return '';
  }

  validateRoleName(): void {
    this.roleNameControl?.markAsTouched();
  }

  // ============================================================
  // Data loading
  // ============================================================
  getAllPagesWithControlOrPermissions(): void {
    this.isLoadingPages = true;
    this._pageService.getAllPagesWithControls().subscribe({
      next: res => {
        this.pagesResponse = (res.result || [])
          .filter(page => page.isActive !== false)
          .sort((a, b) => (a.seriolNumber ?? 0) - (b.seriolNumber ?? 0));
        this.initializePermissions();
        this.isLoadingPages = false;
      },
      error: () => {
        this.isLoadingPages = false;
        this.pushToast('error', 'Could not load modules. Please refresh the page.');
      }
    });
  }

  initializePermissions(): void {
    this.pagesResponse.forEach(page => {
      this.permissionsMap.set(page.id, [
        { isView: false, isAdd: false, isEdit: false, isDelete: false }
      ]);
    });
  }

  getApplicationUser(): void {
    this.isLoadingUsers = true;
    this._userRegistrationService.getAllUsersWithRoles().subscribe({
      next: res => {
        this.userList = (res.result || []).map(role => ({ ...role, expand: false }));
        this.isLoadingUsers = false;
      },
      error: () => {
        this.isLoadingUsers = false;
        this.pushToast('error', 'Could not load roles. Please refresh the page.');
      }
    });
  }

  // ============================================================
  // Module tree helpers
  // ============================================================
  get filteredParentPages(): PageResponse[] {
    const term = this.moduleSearchTerm.trim().toLowerCase();
    const parents = this.pagesResponse.filter(page => !page.parentId);
    if (!term) return parents;

    return parents.filter(parent => {
      const parentMatches = parent.title?.toLowerCase().includes(term);
      const childMatches = this.getChildren(parent.id).some(child =>
        child.title?.toLowerCase().includes(term)
      );
      return parentMatches || childMatches;
    });
  }

  getChildren(parentId: number): PageResponse[] {
    return this.pagesResponse.filter(page => page.parentId === parentId);
  }

  toggleCollapse(parent: PageResponse): void {
    parent.isCollapsed = !parent.isCollapsed;
  }

  getPermissionsForPage(pageId: number): RolePagePermissionBox[] {
    return this.permissionsMap.get(pageId) || [];
  }

  // ============================================================
  // Checkbox interactions
  // ============================================================
  onAllChecked(permissionKey: keyof RolePagePermissionBox, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.pagesResponse.forEach(page => {
      this.getPermissionsForPage(page.id).forEach(permission => {
        permission[permissionKey] = checked;
      });
    });
    this.refreshCheckedStatus();
  }

  onPermissionChange(permissions: RolePagePermissionBox, key: keyof RolePagePermissionBox, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    permissions[key] = checked;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const allPerms = (key: keyof RolePagePermissionBox) =>
      this.pagesResponse.flatMap(page => this.getPermissionsForPage(page.id));

    const total = allPerms('isView').length || 1;

    const countTrue = (key: keyof RolePagePermissionBox) =>
      allPerms(key).filter(p => p[key]).length;

    const viewCount = countTrue('isView');
    const addCount = countTrue('isAdd');
    const editCount = countTrue('isEdit');
    const deleteCount = countTrue('isDelete');

    this.checkedView = viewCount === total;
    this.checkedAdd = addCount === total;
    this.checkedEdit = editCount === total;
    this.checkedDelete = deleteCount === total;

    this.indeterminateView = viewCount > 0 && !this.checkedView;
    this.indeterminateAdd = addCount > 0 && !this.checkedAdd;
    this.indeterminateEdit = editCount > 0 && !this.checkedEdit;
    this.indeterminateDelete = deleteCount > 0 && !this.checkedDelete;

    this.isFormChanged = true;
  }

  // ============================================================
  // Save / Reset
  // ============================================================
  savePermissions(): void {
    if (this.isSaving) return;

    this.roleNameControl?.markAsTouched();
    if (this.roleNameControl?.invalid) {
      this.scrollTop();
      return;
    }

    this.isSaving = true;

    const payload = {
      name: this.roleName,
      globalId: this.globalId,
      rolePagePermissions: this.pagesResponse.map(page => {
        const permissions = this.permissionsMap.get(page.id) || [];
        const permission = permissions[0] || { isView: false, isAdd: false, isEdit: false, isDelete: false };

        return {
          pageId: page.id,
          parentId: page.parentId,
          isView: !!permission.isView,
          isAdd: !!permission.isAdd,
          isEdit: !!permission.isEdit,
          isDelete: !!permission.isDelete,
          roleControlPermissions: page.pageControls?.map(control => ({
            pageId: page.id,
            controlId: control.id,
            isView: !!control.isView
          })) || []
        };
      })
    };

    this._pageService.saveRoleAndRights(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.pushToast('success', this.editMode ? 'Role updated successfully.' : 'Role created successfully.');
        this.resetForm();
        this.getApplicationUser();
      },
      error: error => {
        this.isSaving = false;
        if (error?.status === 400) {
          this.roleNameControl?.setErrors({ duplicate: true });
          this.roleNameControl?.markAsTouched();
          this.scrollTop();
        } else {
          this.pushToast('error', 'Something went wrong while saving the role. Please try again.');
        }
      }
    });
  }

  resetForm(): void {
    this.roleForm.reset({ roleName: '' });
    this.selectedUser = undefined;
    this.globalId = null;
    this.editMode = false;
    this.moduleSearchTerm = '';

    this.checkedView = false;
    this.checkedAdd = false;
    this.checkedEdit = false;
    this.checkedDelete = false;
    this.indeterminateView = false;
    this.indeterminateAdd = false;
    this.indeterminateEdit = false;
    this.indeterminateDelete = false;

    this.permissionsMap.clear();
    this.initializePermissions();

    this.pagesResponse.forEach(page => {
      page.isCollapsed = false;
      if (Array.isArray(page.pageControls)) {
        page.pageControls.forEach(control => (control.isView = false));
      }
    });

    this.isSaving = false;
    this.isFormChanged = false;
    this.scrollTop();
  }

  // ============================================================
  // Assigned users / roles tab
  // ============================================================
  get filteredUserList(): RoleWithUsersResponse[] {
    const term = this.roleSearchTerm.trim().toLowerCase();
    if (!term) return this.userList;
    return this.userList.filter(role =>
      role.name?.toLowerCase().includes(term) ||
      role.assignedUsers?.some(u =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term)
      )
    );
  }

  getInitials(firstName?: string, lastName?: string): string {
    return `${(firstName || '?').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase();
  }

  onUserClick(roleId: number, user?: RoleWithUsersResponse): void {
    this.selectedUser = user;
    if (roleId <= 0) return;

    this._pageService.getPermissionByRoleId(roleId).subscribe({
      next: res => {
        const roleData = res?.result;
        if (roleData && Array.isArray(roleData.rolePagePermissions) && roleData.rolePagePermissions.length > 0) {
          this.editMode = true;
          this.roleNameControl?.setValue(roleData.name);
          this.globalId = roleData.globalId;

          roleData.rolePagePermissions.forEach((rolePagePermission: RolePagePermissionResponse) => {
            const existing = this.permissionsMap.get(rolePagePermission.pageId) || [
              { isView: false, isAdd: false, isEdit: false, isDelete: false }
            ];
            this.permissionsMap.set(rolePagePermission.pageId, [{
              ...existing[0],
              isView: rolePagePermission.isView,
              isAdd: rolePagePermission.isAdd,
              isEdit: rolePagePermission.isEdit,
              isDelete: rolePagePermission.isDelete,
            }]);

            rolePagePermission.roleControlPermissions?.forEach(controlPermission => {
              const page = this.pagesResponse.find(p => p.id === rolePagePermission.pageId);
              page?.pageControls?.forEach(pageControl => {
                pageControl.isView = controlPermission.isView;
              });
            });
          });

          this.refreshCheckedStatus();
          this.activeTab = 0;
          this.isFormChanged = true;
          this.scrollTop();
          this.cdRef.detectChanges();
        } else {
          this.pushToast('info', 'This role does not have any saved permissions yet.');
        }
      },
      error: () => {
        this.pushToast('error', 'Failed to load permissions for this role.');
      }
    });
  }

  startNewRole(): void {
    this.resetForm();
    this.activeTab = 0;
  }

  // ============================================================
  // Tabs
  // ============================================================
  getMainTab(tabMain: number): string {
    switch (tabMain) {
      case 1: return 'Permissions';
      case 2: return 'Assigned Roles';
      default: return '';
    }
  }

  onTabChange(tabIndex: number): void {
    this.activeTab = tabIndex;
    if (tabIndex === 1) {
      this.userList = this.userList.map(role => ({ ...role, expand: false }));
      this.roleSearchTerm = '';
    }
  }

  // ============================================================
  // Toasts
  // ============================================================
  private pushToast(type: ToastMessage['type'], text: string): void {
    const id = ++this.toastCounter;
    this.toasts.push({ id, type, text });
    setTimeout(() => this.dismissToast(id), 4000);
  }

  dismissToast(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  private scrollTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
