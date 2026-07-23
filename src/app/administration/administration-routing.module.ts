import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignPermissionsComponent } from './components/assign-permissions/assign-permissions.component';
import { AuthGuard } from '../auth/interface/auth.guard';
import { permissionGuard } from '../auth/interface/permission.guard';
import { UserCreateComponent } from './components/user-create/user-create.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UsersPageComponent } from './components/users-page/users-page.component';

const routes: Routes = [
  {path: 'roles', component: AssignPermissionsComponent},
  {path: 'users', component: UsersPageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
