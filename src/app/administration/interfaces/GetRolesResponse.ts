export class GetRolesResponse {
  id: number;         // Unique identifier for the role
  globalId: string;   // Global unique identifier (UUID)
  name: string;       // Name of the role

  constructor(data?: Partial<GetRolesResponse>) {
    this.id = data?.id ?? 0;
    this.globalId = data?.globalId ?? '';
    this.name = data?.name ?? '';
  }
}
export interface formDataGet {
  searchTerm?:  string | null;
  page?: number;
  pageSize?: number;
}
