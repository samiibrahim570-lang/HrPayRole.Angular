import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministrationRoutingModule } from './administration-routing.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- ONLY ReactiveFormsModule
import { AssignPermissionsComponent } from './components/assign-permissions/assign-permissions.component';
import { UserCreateComponent } from './components/user-create/user-create.component';
import { UserListComponent } from './components/user-list/user-list.component';

@NgModule({
  declarations: [
    AssignPermissionsComponent,
    UserCreateComponent,
    UserListComponent
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AdministrationModule { }
