export interface PageItem {
  id: number;
  parentId: number | null;
  title: string;
  path: string;
  type: string;
  icon: string;
  isHidden: boolean;
  isActive: boolean;
  isDeleted: boolean;
  seriolNumber: number;
}

export interface RolePagePermission {
  roleId: number;
  pageId: number;
  page: PageItem;
  isView: boolean;
  isAdd: boolean;
  isEdit: boolean;
  isDelete: boolean;
}

export interface RoleResponse {
  name: string;
  rolePagePermissions: RolePagePermission[];
}

export interface MenuItem extends PageItem {
  children: MenuItem[];
}