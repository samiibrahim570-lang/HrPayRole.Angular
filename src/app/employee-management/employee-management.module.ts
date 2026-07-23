import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeManagementRoutingModule } from './employee-management-routing.module';
import { AddDepartmentComponent } from './components/add-department/add-department.component';
import { DashboardDepartmentComponent } from './components/dashboard-department/dashboard-department.component';


@NgModule({
  declarations: [
    AddDepartmentComponent,
    DashboardDepartmentComponent
  ],
  imports: [
    CommonModule,
    EmployeeManagementRoutingModule
  ]
})
export class EmployeeManagementModule { }
