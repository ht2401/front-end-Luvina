import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './features/authenricate/login/login.component';
import { UsersModule } from './features/user/users.module';
import { SystemErrorComponent } from './shared/component/error/system-error.component';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from "@angular/common/http";
import { TokenInterceptor } from './shared/auth/token.interceptor';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConfirmComponent } from './features/user/confirm/confirm.component';
import { ADM003Component } from './features/user/adm003/adm003.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SystemErrorComponent,
    ConfirmComponent,
    ADM003Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UsersModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
  ],
  providers: [
    TokenInterceptor
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
