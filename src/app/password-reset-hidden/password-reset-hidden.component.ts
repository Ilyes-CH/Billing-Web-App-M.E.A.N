import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/Services/auth.service';
import { ValidatorsService } from 'app/Services/validators.service';
import { PopupService } from '../Services/popup.service';

@Component({
  selector: 'app-password-reset-hidden',
  templateUrl: './password-reset-hidden.component.html',
  styleUrls: ['./password-reset-hidden.component.scss']
})
export class PasswordResetHiddenComponent implements OnInit {
  codeError: string
  error: string
  resetPasswordForm!: FormGroup
  otpVerificationRes: string
  constructor(private popup: PopupService, private validators: ValidatorsService, private router: Router, private activatedRoute: ActivatedRoute, private auth: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    const token = this.activatedRoute.snapshot.params['token']
    if (!token) {
      // console.log(token)
      this.router.navigate(['access-denied']);
    } else {

      this.auth.verifyOtpToken(token).subscribe({
        next: (res) => {
          if (res.ok) {
            console.log(token)
          }
        }, error: (err) => {
          if (err.status == 403) {

            this.router.navigate(['access-denied']);
          }
        }
      })
    }

    this.resetPasswordForm = this.formBuilder.group({
      code: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required,]],
    }, { validators: this.validators.passwordMatchValidator() })




  }
  resetPassword() {
    this.auth.resetPassword(this.resetPasswordForm.value).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status == 200) {
          // Show success notification
          this.popup.showNotification('bottom', 'left', 'success', 'Password updated successfully.');
          
          // Navigate to the user profile page
          this.router.navigate(['login']);
        } else {
          // If response status is not 200, show a generic error
          this.popup.showNotification('bottom', 'left', 'success', 'Password updated successfully.');
        }
      },
      error: (err) => {
        console.log(err);
        // Show error notification if an error occurs
        this.popup.showNotification('bottom', 'left', 'danger', 'Error updating password, try again.');
      }
    });
    console.log(this.resetPasswordForm.value);
  }
  
}
