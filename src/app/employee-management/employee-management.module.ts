import { NgModule } from '@angular/core';

import { AddDepartmentComponent } from './components/add-department/add-department.component';
import { DashboardDepartmentComponent } from './components/dashboard-department/dashboard-department.component';
import { CommonModule } from '@angular/common';
import { EmployeeManagementRoutingModule } from './employee-management-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AddDepartmentComponent,
    DashboardDepartmentComponent
  ],
  imports: [
    CommonModule,
    EmployeeManagementRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class EmployeeManagementModule { }