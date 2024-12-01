import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'app/Services/user.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css', '../../app.component.css']
})
export class UserProfileComponent implements OnInit {

  public user: any = {}
  public editUserForm :any = {}
  constructor(private userService: UserService,private router:Router) { }

  ngOnInit() {
    const accessToken = sessionStorage.getItem('accessToken')
    if (accessToken) {
      const decoded = jwtDecode(accessToken)
      console.log(decoded)
      this.userService.getUserById(decoded['id']).subscribe({
        next: (res) => {
          console.log(res)
          this.user = res.body['data']
          console.log(this.user)
        }, error: (err) => {
          console.log(err)
        }
      })

    }else{
      this.router.navigate(["access-denied"])
    }
  }
  save(){
    this.userService.updateUser(this.user).subscribe({
      next:(res)=>{
console.log(res)
      },error:(err)=>{
        console.log(err)

      }
    })
  }

}
