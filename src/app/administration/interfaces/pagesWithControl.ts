export interface PageControl {
  pageId: number;
  controlId: number;
  name: string;
  isView: boolean;
  isActive: boolean;
  isDelete: boolean;
  createdOn: string;
  createdBy: number;
  modifiedOn: string;
  modifiedBy: number;
  id: number;
  globalId: string;
}

export interface RolePagePermission {
  roleId: number;
  pageId: number;
  parentId: number;
  isView: boolean;
  isAdd: boolean;
  isEdit: boolean;
  isDelete: boolean;
  isActive: boolean;
  createdOn: string;
  createdBy: number;
  modifiedOn: string;
  modifiedBy: number;
  id: number;
  globalId: string;
}


export interface PageResponse {
  parentId?: number;
  isCollapsed: boolean;
  title: string;
  path: string;
  type: string;
  icon: string;
  isHidden: boolean;
  translate: string;
  classes: string;
  seriolNumber: number;
  groupClasses: string;
  isExactMatch: boolean;
  isTarget: boolean;
  isBreadCrumb: boolean;
  description: string;
  link: string;
  rolePagePermissions: RolePagePermission[];
  pageControls: PageControl[];
  isActive: boolean;
  isDeleted: boolean;
  createdOn: string;
  createdBy: number;
  modifiedOn: string;
  modifiedBy: number;
  id: number;
  globalId: string;
}

export class Role {
  constructor(
    public name: string,
    public rolePagePermissions: RolePagePermissionResponse[] = [],
    public isActive: boolean,
    public isDeleted: boolean,
    public createdOn: string,
    public createdBy: number,
    public modifiedOn: string,
    public modifiedBy: number,
    public id: number,
    public globalId: string
  ) {}
}

// export class RolePagePermissionResponse {
//   constructor(
//     public roleId: number,
//     public pageId: number,
//     public pageName: string,
//     public isCollapsed: boolean,
//     public parentId: number,
//     public isView: boolean,
//     public isAdd: boolean,
//     public isEdit: boolean,
//     public isDeleted: boolean,
//     public roleControlPermissions: RoleControlPermissionResponse[] = [],
//     public isActive: boolean,
//     public createdOn: string,
//     public createdBy: number,
//     public modifiedOn: string,
//     public modifiedBy: number,
//     public id: number,
//     public globalId: string
//   ) {}
// }

// export class RoleControlPermissionResponse {
//   constructor(
//     public rolePagePermissionId: number,
//     public pageId: number,
//     public controlId: number,
//     public isView: boolean,
//     public isActive: boolean,
//     public isDeleted: boolean,
//     public createdOn: string,
//     public createdBy: number,
//     public modifiedOn: string,
//     public modifiedBy: number,
//     public id: number,
//     public globalId: string
//   ) {}
// }

export interface UserRegisterResponse {
  id: number,
  globalId: string,
  email: string;
  password?: string; // Optional property
  confirmPassword?: string; // Optional property
  firstName: string;
  lastName: string;
  contactNumber: string;
  address: string;
  image: string;
  createdOn: string;
  modifiedOn: string;
  createdByName: string;
  modifiedByName: string;
  whatsAppNumber: string;
  phoneNumber: string;
  roleName:string;
  roleId:number;
  isActive: boolean;
}


// Interface for the page data
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

// Interface for role page permission
export interface RolePagePermissionResponse {
  roleId: number;
  pageId: number;
  page: Page;
  parentId: number;
  isView: boolean;
  isAdd: boolean;
  isEdit: boolean;
  isDelete: boolean;
  isActive: boolean;
  createdOn: string;
  createdBy: number;
  modifiedOn: string | null;
  modifiedBy: number | null;
  id: number;
  globalId: string;
  roleControlPermissions?: ControlPermission[];
}

// Interface for control permission data
export  interface ControlPermission {
  isView: boolean;
  isAdd: boolean;
  isEdit: boolean;
  isDelete: boolean;
}



// role-with-users-response.model.ts

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

