import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'app/Services/user.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent implements OnInit {

  constructor(private formBuilder:FormBuilder,private userService: UserService ) { }
  public statement : string  = "Before Creating An Account we will need to  verify your email address please "
  public isSent: boolean | null = null; 
  private role;
  emailVerificationForm !: FormGroup
  ngOnInit(): void {
    this.role = localStorage.getItem('choice') || ''
  this.emailVerificationForm = this.formBuilder.group({
    role:[this.role],
    email :['',[Validators.required,Validators.email]]
  })
  
  }
  sendEmail(){
    console.log(this.emailVerificationForm.value)
      if (this.emailVerificationForm.valid) {
        if(this.role == '') return this.isSent = false
        this.userService.verifyEmail(this.emailVerificationForm.value).subscribe((res) => {
          this.isSent = res.ok;
        }, error => {
          console.error("Error verifying email", error);
          this.isSent = false;
        });
      }
  }
}
