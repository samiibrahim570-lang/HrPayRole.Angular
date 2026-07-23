import { Component, OnInit } from '@angular/core';
import { DepartmentResponse } from '../../interface/Department';
import { DepartmentService } from '../../service/department.service';

type View = 'dashboard' | 'add' | 'edit';

@Component({
  selector: 'app-dashboard-department',
  templateUrl: './dashboard-department.component.html',
  styleUrls: ['./dashboard-department.component.css']
})
export class DashboardDepartmentComponent implements OnInit {

  // View control — no routing needed
  currentView: View = 'dashboard';
  selectedDepartmentId: number = 0;

  departments: DepartmentResponse[] = [];
  filteredDepartments: DepartmentResponse[] = [];
  pagedDepartments: DepartmentResponse[] = [];

  isLoading = false;
  errorMessage = '';

  activeFilter: 'All' | 'Active' | 'Inactive' = 'All';

  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  totalDepartments = 0;
  activeDepartments = 0;
  inactiveDepartments = 0;

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  // ── View switching ──────────────────────────────────────
  showAddForm(): void {
    this.selectedDepartmentId = 0;
    this.currentView = 'add';
  }

  showEditForm(id: number): void {
    this.selectedDepartmentId = id;
    this.currentView = 'edit';
  }

  showDashboard(): void {
    this.currentView = 'dashboard';
    this.loadDepartments(); // refresh after add/edit
  }

  // ── Data ───────────────────────────────────────────────
  loadDepartments(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.departmentService.getAll().subscribe({
      next: (res) => {
        this.departments = res.result || [];
        this.calculateStats();
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load departments.';
        this.isLoading = false;
      }
    });
  }

  calculateStats(): void {
    this.totalDepartments   = this.departments.length;
    this.activeDepartments  = this.departments.filter(d => d.isActive).length;
    this.inactiveDepartments = this.departments.filter(d => !d.isActive).length;
  }

  setFilter(filter: 'All' | 'Active' | 'Inactive'): void {
    this.activeFilter = filter;
    this.currentPage = 1;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.activeFilter === 'Active') {
      this.filteredDepartments = this.departments.filter(d => d.isActive);
    } else if (this.activeFilter === 'Inactive') {
      this.filteredDepartments = this.departments.filter(d => !d.isActive);
    } else {
      this.filteredDepartments = [...this.departments];
    }
    this.totalPages = Math.ceil(this.filteredDepartments.length / this.pageSize) || 1;
    this.setPage(1);
  }

  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const start = (page - 1) * this.pageSize;
    this.pagedDepartments = this.filteredDepartments.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get showingStart(): number {
    return this.filteredDepartments.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredDepartments.length);
  }

  deactivateDepartment(id: number): void {
    if (!confirm('Are you sure you want to deactivate this department?')) return;

    this.departmentService.deactivate(id).subscribe({
      next: () => this.loadDepartments(),
      error: (err) => alert(err.message || 'Failed to deactivate department.')
    });
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short', day: '2-digit', year: 'numeric'
    });
  }
}