import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRegisterResponse } from '../../interfaces/pagesWithControl';
import { UserregistrationService } from '../../sservices/userregistration.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

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

  constructor(
    private userService: UserregistrationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMsg = '';
    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        this.allUsers = response?.data ?? [];
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
    this.filteredUsers = !term
      ? [...this.allUsers]
      : this.allUsers.filter(u =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(term) ||
        (u.email ?? '').toLowerCase().includes(term) ||
        (u.contactNumber ?? '').toLowerCase().includes(term) ||
        (u.roleName ?? '').toLowerCase().includes(term)
      );

    this.currentPage = 1;
    this.updatePagination();
  }

  onSearchChange(): void {
    this.applyFilter();
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
    this.router.navigate(['/users/create']);
  }

  onEdit(user: UserRegisterResponse): void {
    this.router.navigate(['/users/edit', user.globalId]);
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
