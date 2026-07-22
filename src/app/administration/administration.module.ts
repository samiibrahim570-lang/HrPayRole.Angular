import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministrationRoutingModule } from './administration-routing.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms'; // <-- ONLY ReactiveFormsModule
import { AssignPermissionsComponent } from './components/assign-permissions/assign-permissions.component';

@NgModule({
  declarations: [
    AssignPermissionsComponent
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule // <-- ONLY ReactiveFormsModule, NO FormsModule
  ]
})
export class AdministrationModule { }
