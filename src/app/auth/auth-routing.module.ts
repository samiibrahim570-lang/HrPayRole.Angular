import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ForgetpasswordComponent } from './components/forgetpassword/forgetpassword.component';
import { NewpasswordComponent } from './components/newpassword/newpassword.component';
import { AuthinterceptorService } from './service/authinterceptor.service';


const routes: Routes = [
  { path: 'sign-in', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}