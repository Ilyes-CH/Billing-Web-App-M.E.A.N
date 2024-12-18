import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, PipeTransform } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './layouts/login/login.component';
import { SignupComponent } from './layouts/signup/signup.component';
import { NoticesComponent } from './layouts/notices/notices.component';
import { InvoicesComponent } from './layouts/invoices/invoices.component';
import { PasswordResetHiddenComponent } from './password-reset-hidden/password-reset-hidden.component';
import { NotFoundComponent } from './layouts/not-found/not-found.component';
import { AccessDeniedComponent } from './layouts/access-denied/access-denied.component';
import { ReportsComponent } from './layouts/reports/reports.component';
import { ReportDetailsComponent } from './layouts/report-details/report-details.component';
import { FeedbacksComponent } from './layouts/feedbacks/feedbacks.component';
import { EditCourseComponent } from './layouts/edit-course/edit-course.component';
import { RequestCacheInterceptor } from './Services/request-cache.interceptor';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    SignupComponent,
    NoticesComponent,
    InvoicesComponent,
    PasswordResetHiddenComponent,
    NotFoundComponent,
    AccessDeniedComponent,
    ReportsComponent,
    ReportDetailsComponent,
    FeedbacksComponent,
    EditCourseComponent,
    

    

  ],
  providers: [
    {
      provide:HTTP_INTERCEPTORS,
      useClass:RequestCacheInterceptor,
      multi:true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
