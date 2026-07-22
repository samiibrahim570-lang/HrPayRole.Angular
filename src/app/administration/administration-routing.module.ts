import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignPermissionsComponent } from './components/assign-permissions/assign-permissions.component';
import { AuthGuard } from '../auth/interface/auth.guard';
import { permissionGuard } from '../auth/interface/permission.guard';
import { UserCreateComponent } from './components/user-create/user-create.component';

const routes: Routes = [
  {path: 'roles', component: AssignPermissionsComponent},
  {path: 'users', component: UserCreateComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
