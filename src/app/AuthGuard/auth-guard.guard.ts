import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from 'app/Services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  private protectedRoutes: Array<string> = ["add-course", "edit-course", "dashboard", "reports", "feedbacks", "reports", "reports/reportDetails"];
  private protectedRoutesFromAccountant: Array<string> = ["add-course", "edit-course", "feedbacks"];

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {
    if (this.auth.isUserLoggedIn) {
      if (this.auth.isAdminRole) {
        return true; // Admin has access to all protected routes
      } else if (this.auth.isAccountantRole) {
        // Accountant has limited access
        if (next.routeConfig?.path && !this.protectedRoutesFromAccountant.includes(next.routeConfig?.path)) {
          return true;
        } else {
          this.router.navigate(['access-denied']); // Redirect to access denied for routes not allowed
          return false;
        }
      } else {
        // For other roles, check against the full protected routes list
        if (next.routeConfig?.path && this.protectedRoutes.includes(next.routeConfig?.path)) {
          this.router.navigate(['access-denied']); // Redirect to access denied if the route is restricted
          return false;
        }
      }
    } else {
      this.router.navigate(['login']); // Redirect to login if the user is not authenticated
      return false;
    }
  }
}
