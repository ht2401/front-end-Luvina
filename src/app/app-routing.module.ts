import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/authenricate/login/login.component';
import { UserListComponent } from './features/user/list/user-list.component';
import { UserAddComponent } from './features/user/add/user-add/user-add.component';
import { ConfirmComponent } from './features/user/confirm/confirm.component'; 
import { ADM003Component } from './features/user/adm003/adm003.component';
import { ADM006Component } from './features/user/adm006/adm006.component';
// Khai báo các đường dẫn 
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LoginComponent },
  { path: 'ADM002', component: UserListComponent},
  { path: 'ADM003', component: ADM003Component},
  { path: 'ADM004', component: UserAddComponent},
  { path: 'Confirm', component: ConfirmComponent},
  { path: 'ADM006', component: ADM006Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
