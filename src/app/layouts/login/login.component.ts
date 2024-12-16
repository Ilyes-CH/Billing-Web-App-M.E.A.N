import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'app/Services/user.service';
import { jwtDecode } from 'jwt-decode'
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router, private auth: AuthService) { }
  loginForm !: FormGroup;
  public error!: string;

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  login() {
    this.userService.login(this.loginForm.value).subscribe({
      next: (res) => {
        if (res.ok) {
          if (res.body['accessToken']) {
            localStorage.setItem('refreshToken', res.body['refreshToken']);
            sessionStorage.setItem('accessToken', res.body['accessToken']);
            const user: any = jwtDecode(res.body['accessToken']);
            console.log(user['role']);
            if (user['role'] === 'Accountant') {
              this.auth.adminRole = false;
              this.auth.accountantRole = true;
  
              // Store roles in localStorage
              localStorage.setItem('adminRole', JSON.stringify(false));
              localStorage.setItem('accountantRole', JSON.stringify(true));
              
              this.router.navigate(['dashboard']);

            } else if (user['role'] === 'Admin') {
              this.auth.adminRole = true;
              this.auth.accountantRole = false;
  
              // Store roles in localStorage
              localStorage.setItem('adminRole', JSON.stringify(true));
              localStorage.setItem('accountantRole', JSON.stringify(false));
              
              this.router.navigate(['dashboard']);
            } else {
              this.router.navigate(['']);
              this.auth.adminRole = false;
              this.auth.accountantRole = false;
  
              // Clear roles in localStorage
              localStorage.removeItem('adminRole');
              localStorage.removeItem('accountantRole');
            }
          }
        }
      },
  
      error: (err) => {
        // Handle server errors here
        if (err.status === 401) {
          this.error = "Account is not validated by Admin";
        } else if (err.status === 403) {
          this.error = "Email or Password is incorrect";
        } else {
          this.error = "Internal Server Error";
        }
        console.error(this.error);
      }
    });
  }
  openNewTab(link: string) {
    window.open(link)
  }

}
