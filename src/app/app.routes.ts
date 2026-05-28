import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login';
import { RegisterComponent } from './component/register/register';
import { VerifyComponent } from './component/verify/verify';
import { ResetPasswordComponent } from './component/resetpassword/resetpassword';

export const routes: Routes = [
  {path :'/login',component: LoginComponent },
  {path :'/register', component :RegisterComponent },
  {path : 'verify' ,component :VerifyComponent },
  {path :'/resetpassword',component:ResetPasswordComponent}
];
