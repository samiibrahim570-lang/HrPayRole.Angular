import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { UserRegisterResponse } from '../../interfaces/pagesWithControl';
import { UserregistrationService } from '../../sservices/userregistration.service';

type SortKey = 'name' | 'email' | 'role' | 'status';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  // Router.navigate() ki jagah — parent (users-page) inhe sun kar tab badalta hai
  @Output() addUser = new EventEmitter<void>();
  @Output() editUser = new EventEmitter<string>(); // globalId bhejta hai

  allUsers: UserRegisterResponse[] = [];
  filteredUsers: UserRegisterResponse[] = [];
  pagedUsers: UserRegisterResponse[] = [];

  searchTerm = '';
  loading = false;
  errorMsg = '';

  // simple client-side pagination
  pageSize = 10;
  currentPage = 1;
  totalPages = 1;

  // used to disable the delete button on the row being deleted
  deletingGlobalId: string | null = null;

  // grid sorting
  sortKey: SortKey = 'name';
  sortDir: SortDir = 'asc';

  constructor(private userService: UserregistrationService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMsg = '';
    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        this.allUsers = response?.result ?? [];
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.errorMsg = 'Unable to load users. Please try again.';
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    let result = !term
      ? [...this.allUsers]
      : this.allUsers.filter(u =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(term) ||
        (u.email ?? '').toLowerCase().includes(term) ||
        (u.contactNumber ?? '').toLowerCase().includes(term) ||
        (u.whatsAppNumber ?? '').toLowerCase().includes(term) ||
        (u.roleName ?? '').toLowerCase().includes(term)
      );

    result = this.sortUsers(result);

    this.filteredUsers = result;
    this.currentPage = 1;
    this.updatePagination();
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  sortBy(key: SortKey): void {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDir = 'asc';
    }
    this.applyFilter();
  }

  private sortUsers(users: UserRegisterResponse[]): UserRegisterResponse[] {
    const dir = this.sortDir === 'asc' ? 1 : -1;

    return [...users].sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';

      switch (this.sortKey) {
        case 'name':
          valA = `${a.firstName ?? ''} ${a.lastName ?? ''}`.toLowerCase();
          valB = `${b.firstName ?? ''} ${b.lastName ?? ''}`.toLowerCase();
          break;
        case 'email':
          valA = (a.email ?? '').toLowerCase();
          valB = (b.email ?? '').toLowerCase();
          break;
        case 'role':
          valA = (a.roleName ?? '').toLowerCase();
          valB = (b.roleName ?? '').toLowerCase();
          break;
        case 'status':
          valA = a.isActive ? 1 : 0;
          valB = b.isActive ? 1 : 0;
          break;
      }

      if (valA < valB) return -1 * dir;
      if (valA > valB) return 1 * dir;
      return 0;
    });
  }

  updatePagination(): void {
    this.totalPages = Math.max(1, Math.ceil(this.filteredUsers.length / this.pageSize));
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedUsers = this.filteredUsers.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onAdd(): void {
    this.addUser.emit();
  }

  onEdit(user: UserRegisterResponse): void {
    this.editUser.emit(user.globalId);
  }

  onDelete(user: UserRegisterResponse): void {
    if (!user.globalId) return;

    const confirmed = confirm(`Delete user "${user.firstName} ${user.lastName}"? This cannot be undone.`);
    if (!confirmed) return;

    this.deletingGlobalId = user.globalId;

    this.userService.deletecusById(user.globalId).subscribe({
      next: () => {
        this.deletingGlobalId = null;
        this.loadUsers(); // refresh the list after delete
      },
      error: (err) => {
        console.error('Failed to delete user', err);
        this.errorMsg = 'Unable to delete user. Please try again.';
        this.deletingGlobalId = null;
      }
    });
  }

  trackByGlobalId(index: number, user: UserRegisterResponse): string {
    return user.globalId;
  }
}
