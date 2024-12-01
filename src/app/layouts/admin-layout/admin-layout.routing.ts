import { Routes } from '@angular/router';

import { DashboardComponent } from '../dashboard/dashboard.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { TableListComponent } from '../table-list/table-list.component';
import { TypographyComponent } from '../typography/typography.component';
import { IconsComponent } from '../icons/icons.component';
import { MapsComponent } from '../maps/maps.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { HomeComponent } from 'app/layouts/home/home.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { FeedbackComponent } from '../feedback/feedback.component';
import { EmailVerificationComponent } from '../email-verification/email-verification.component';
import { CourseDetailsComponent } from '../course-details/course-details.component';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { ServicesComponent } from '../courses/services.component';
import { InvoicesComponent } from '../invoices/invoices.component';
import { NoticesComponent } from '../notices/notices.component';
import { NoticesandinvoicesComponent } from '../noticesandinvoices/noticesandinvoices.component';
import { AddCourseComponent } from '../add-course/add-course.component';
import { GetPricingComponent } from '../get-pricing/get-pricing.component';
import { CreateNoticeComponent } from '../create-notice/create-notice.component';
import { PurchasesComponent } from '../purchases/purchases.component';
import { CartComponent } from '../cart/cart.component';
import { NewsComponent } from '../news/news.component';
import { PasswordResetHiddenComponent } from 'app/password-reset-hidden/password-reset-hidden.component';
import { FeedbacksComponent } from '../feedbacks/feedbacks.component';
import { ReportsComponent } from '../reports/reports.component';
import { ReportDetailsComponent } from '../report-details/report-details.component';
import { EditCourseComponent } from '../edit-course/edit-course.component';
import { AuthGuardGuard } from 'app/AuthGuard/auth-guard.guard';



export const AdminLayoutRoutes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardGuard] },
    { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuardGuard] },
    { path: 'table-list', component: TableListComponent, canActivate: [AuthGuardGuard] },
    { path: 'typography', component: TypographyComponent, canActivate: [AuthGuardGuard] },
    { path: 'icons', component: IconsComponent, canActivate: [AuthGuardGuard] },
    { path: 'maps', component: MapsComponent, canActivate: [AuthGuardGuard] },
    { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuardGuard] },
    { path: 'upgrade', component: UpgradeComponent }, // No auth guard here
    { path: 'reset-password/verify', component: ResetPasswordComponent }, // No auth guard here
    { path: 'password-reset/:token', component: PasswordResetHiddenComponent }, // No auth guard here
    { path: 'feedback', component: FeedbackComponent }, // No auth guard here
    { path: 'verify-email', component: EmailVerificationComponent }, // No auth guard here
    { path: 'course-details/:id', component: CourseDetailsComponent, canActivate: [AuthGuardGuard] },
    { path: 'user-details/:id', component: UserDetailsComponent, canActivate: [AuthGuardGuard] },
    { path: 'courses', component: ServicesComponent },
    { path: 'invoices', component: InvoicesComponent, canActivate: [AuthGuardGuard] },
    { path: 'notices', component: NoticesComponent, canActivate: [AuthGuardGuard] },
    { path: 'files', component: NoticesandinvoicesComponent, canActivate: [AuthGuardGuard] },
    { path: 'add-course', component: AddCourseComponent, canActivate: [AuthGuardGuard] },
    { path: 'get-pricing', component: GetPricingComponent, canActivate: [AuthGuardGuard] },
    { path: 'reset-password', component: ResetPasswordComponent }, // No auth guard here
    { path: 'create-notice/:id', component: CreateNoticeComponent, canActivate: [AuthGuardGuard] },
    { path: 'purchases', component: PurchasesComponent, canActivate: [AuthGuardGuard] },
    { path: 'cart', component: CartComponent, canActivate: [AuthGuardGuard] },
    { path: 'news', component: NewsComponent },
    { path: 'feedbacks', component: FeedbacksComponent, canActivate: [AuthGuardGuard] },
    { path: 'reports', component: ReportsComponent, canActivate: [AuthGuardGuard] },
    { path: 'reports/reportDetails/:id', component: ReportDetailsComponent, canActivate: [AuthGuardGuard] },
    { path: 'edit-course/:id', component: EditCourseComponent, canActivate: [AuthGuardGuard] }
  ];
  