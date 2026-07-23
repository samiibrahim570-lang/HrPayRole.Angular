import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDepartmentComponent } from './components/add-department/add-department.component';
import { DashboardComponent } from '../dashboard/components/dashboard/dashboard.component';
import { DashboardDepartmentComponent } from './components/dashboard-department/dashboard-department.component';

const routes: Routes = [

    {path: 'departments', component: DashboardDepartmentComponent},
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeManagementRoutingModule { }
