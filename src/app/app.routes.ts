import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login';
import { RegisterComponent } from './component/register/register';
import { VerifyComponent } from './component/verify/verify';
import { ResetPasswordComponent } from './component/resetpassword/resetpassword';
import { Customers } from './component/customers/customers';
import {  ProfileComponent } from './component/profile/profile';
import { Home } from './component/home/home';
import { AuthenticationGuard } from './component/guard/authentication.guard';
import { Newcustomer } from './component/newcustomer/newcustomer';
import {Newinvoice } from './component/newinvoice/newinvoice';
import { Invoices } from './component/invoices/invoices';
import { Customer } from './component/customer/customer';
import { InvoiceComponent } from './component/invoice/invoice';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'resetpassword', component: ResetPasswordComponent },
  { path: 'user/verify/password/:key', component: VerifyComponent },
  { path: 'user/verify/account/:key', component: VerifyComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthenticationGuard] },
  { path: 'customers', component: Customers, canActivate: [AuthenticationGuard] },
  { path: 'customers/new', component: Newcustomer, canActivate: [AuthenticationGuard] },
  { path: 'invoices/new', component: Newinvoice, canActivate: [AuthenticationGuard] },
  { path: 'invoices', component: Invoices, canActivate: [AuthenticationGuard] },
  { path: 'customers/:customerId', component: Customer, canActivate: [AuthenticationGuard] },
  { path: 'invoices/:id/:invoiceNumber', component: InvoiceComponent, canActivate: [AuthenticationGuard] },
  { path: '', component: Home, canActivate: [AuthenticationGuard] },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', component: Home },
];
