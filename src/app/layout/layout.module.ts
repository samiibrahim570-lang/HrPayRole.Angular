import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';


@NgModule({
  declarations: [
    MainLayoutComponent,
    AuthLayoutComponent,
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    
  ]
})
export class LayoutModule { }
