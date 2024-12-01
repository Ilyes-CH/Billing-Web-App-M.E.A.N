import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/Services/auth.service';
import { PopupService } from 'app/Services/popup.service';
import { UserService } from 'app/Services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss',"../../app.component.css"]
})
export class SignupComponent implements OnInit {
  public role: string = localStorage.getItem('choice') || '';
  public user: any = {
    role: this.role
  };
  signupForm!:FormGroup
  public showPassword: boolean = false;
  public adminExists: boolean = false;
  private imageFile!: File;
  fileError: string | null = null;
  constructor(private popup: PopupService,private userService: UserService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.checkAdmin().subscribe((res) => {
      if (res.status == 200) {
        this.adminExists = true;
      } else {
        this.adminExists = false;
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  
  signup(): void {
    console.log(this.user)
      this.userService.signup(this.user, this.imageFile).subscribe({
        next: (res) => {
          if (res.status === 201) {
            this.router.navigate(['login']);
          }
        },
        error: (err) => {
          if (err.status !== 201) {
            this.popup.showNotification('bottom', 'right', 'danger', err.error['message']);
          }
        },
      });
  }
  
  getImage(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      this.imageFile = inputElement.files[0];
      this.fileError = null;
    }else{
        this.fileError = 'No file selected'
    }
  }

  isAlpha(value: string): boolean {
    const alphaRegex = /^[a-zA-Z]+$/;
    return alphaRegex.test(value);
  }
  isNumeric(value: string ): boolean {
    const numericRegex = /^[0-9]+$/;
    return numericRegex.test(value);
  }


  isEmpty(value: string): boolean {
    return value.trim().length === 0;
  }

  isAlphaNumeric(value: string): boolean {
    const alphaNumericRegex = /^[a-zA-Z0-9]+$/;
    return alphaNumericRegex.test(value);
  }
  isShort(value: string): boolean {
    return value.length < 4 
  }
  isShortNumber(value: string): boolean {
    return  value.length <= 10 && value.length >= 8
  }
  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
}
