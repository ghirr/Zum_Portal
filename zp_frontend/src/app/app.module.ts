import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { RouterModule } from '@angular/router';
import { ToasterService } from './core/services/toaster/toaster.service';
import { JwtInterceptor } from './Common/Interceptors/jwt.interceptor';
import { ErrorInterceptor } from './Common/Interceptors/error.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
]
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule,
    SharedModule,
  ],
  providers: [httpInterceptorProviders,ToasterService],
  bootstrap: [AppComponent],
})
export class AppModule {}
