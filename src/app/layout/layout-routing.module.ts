import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { AuthGuard } from '../auth/interface/auth.guard';

  const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {path: 'dashboard', loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule)},
      {path: 'administration', loadChildren: () => import('../administration/administration.module').then(m => m.AdministrationModule)},
      {path: 'employees', loadChildren: () => import('../employee-management/employee-management.module').then(m => m.EmployeeManagementModule)},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
