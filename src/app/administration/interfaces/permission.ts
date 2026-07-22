export interface RoleWithUsersResponse {
  id: number;
  name: string;
  expand: boolean;
  assignedUsers: ApplicationUserAlongRole[];
}

export interface ApplicationUserAlongRole {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roleId?: number; // Optional field
}
export interface RolePagePermissionResponse {
  roleId: number;
  pageId: number;
  page: Page;
  pageName: string;
  isCollapsed: boolean;
  parentId: number;
  isView: boolean;
  isAdd: boolean;
  isEdit: boolean;
  isDelete: boolean;
  // isDeleted: boolean;
  roleControlPermissions: RolePagePermissionResponse[];
  isActive: boolean;
  createdOn: string;
  createdBy: number;
  modifiedOn: string;
  modifiedBy: number;
  id: number;
  globalId: string;
}
export  interface Page {
  parentId: number;
  isCollapsed: boolean;
  title: string;
  path: string;
  type: string;
  icon: string;
  isHidden: boolean;
  description: string;
  link: string | null;
  isActive: boolean;
  isDeleted: boolean;
  createdOn: string;
  createdBy: number;
  modifiedOn: string | null;
  modifiedBy: number | null;
  id: number;
  globalId: string;
}
