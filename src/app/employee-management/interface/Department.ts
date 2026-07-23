export interface DepartmentResponse {
    id: number;
    departmentName: string;
    departmentCode?: string;
    description?: string;
    isActive: boolean;
    createdOn: Date;
    modifiedOn?: Date;
}

export interface CreateDepartmentRequest {
    id: number;
    departmentName: string;
    departmentCode?: string;
    description?: string;
    isActive: boolean;
}