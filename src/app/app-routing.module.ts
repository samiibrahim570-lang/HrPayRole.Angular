import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/interface/auth.guard';
import { LoginComponent } from './auth/components/login/login.component';
import { AuthinterceptorService } from './auth/service/authinterceptor.service';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthModule),
  },

{
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./layout/layout.module').then((m) => m.LayoutModule),
  },

  { path: '', redirectTo: 'auth/sign-in', pathMatch: 'full' },

  { path: '**', redirectTo: 'auth/sign-in' },
  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}