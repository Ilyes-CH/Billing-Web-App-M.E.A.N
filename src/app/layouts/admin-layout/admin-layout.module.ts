import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { TableListComponent } from '../table-list/table-list.component';
import { TypographyComponent } from '../typography/typography.component';
import { IconsComponent } from '../icons/icons.component';
import { MapsComponent } from '../maps/maps.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import { HomeComponent } from 'app/layouts/home/home.component';
import { CourseComponent } from 'app/layouts/course/course.component';
import { FeedbackComponent } from '../feedback/feedback.component';
import { EmailVerificationComponent } from '../email-verification/email-verification.component';
import { TodoComponent } from '../todo/todo.component';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { CourseDetailsComponent } from '../course-details/course-details.component';  
import { ServicesComponent } from '../courses/services.component';
import { NoticesandinvoicesComponent } from '../noticesandinvoices/noticesandinvoices.component';
import { AddCourseComponent } from '../add-course/add-course.component';
import { GetPricingComponent } from '../get-pricing/get-pricing.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { CreateNoticeComponent } from '../create-notice/create-notice.component';
import { PurchasesComponent } from '../purchases/purchases.component';
import { CartComponent } from '../cart/cart.component';
import { NewsComponent } from '../news/news.component';
import { HomeFeedbackComponent } from '../home-feedback/home-feedback.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    HomeComponent,
    CourseComponent,
    FeedbackComponent,
    EmailVerificationComponent,
    TodoComponent,
    CourseComponent,
    UserDetailsComponent,
    CourseDetailsComponent,
    ServicesComponent,
    NoticesandinvoicesComponent,
    AddCourseComponent,
    GetPricingComponent,
    ResetPasswordComponent,
    CreateNoticeComponent,
    PurchasesComponent,
    CartComponent,
    NewsComponent,
    HomeFeedbackComponent
  ]
})

export class AdminLayoutModule {}
