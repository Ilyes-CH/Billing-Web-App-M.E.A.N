import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/Services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss', '../../app.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public isVerified: boolean
  public isSent: boolean = null
  emailVerificationForm!: FormGroup

  constructor(private router: Router,private formBuilder: FormBuilder, private auth: AuthService) { }

  ngOnInit(): void {
    this.emailVerificationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    })
  }

  sendEmail() {
    //send email to verify identity
    this.auth.verifyIdentity(this.emailVerificationForm.value).subscribe({
      next: (res) => {
        //if email is sent change layout to send code
        this.isSent = true
        console.log(res)
        this.router.navigate([`password-reset/${res.body["token"]}`])
      }, error: (err) => {
        this.isSent = false
        console.log(err)

      }
    })

  }

}
