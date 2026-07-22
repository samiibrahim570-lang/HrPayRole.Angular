import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignPermissionsComponent } from './components/assign-permissions/assign-permissions.component';
import { AuthGuard } from '../auth/interface/auth.guard';
import { permissionGuard } from '../auth/interface/permission.guard';

const routes: Routes = [
  {path: 'roles', component: AssignPermissionsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
