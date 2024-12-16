import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/Services/auth.service';
import { jwtDecode } from 'jwt-decode';


declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export var ROUTES: RouteInfo[] = [
  { path: '', title: 'Home', icon: 'home', class: 'bg-gradient-secondary' },
  { path: '/courses', title: 'Courses', icon: 'content_paste', class: '' },
  { path: '/news', title: 'News', icon: 'vertical_split', class: '' },
  
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  public user :any = {}
  constructor(private authService: AuthService,private router :Router) { }
//to be changed with the new getter in auth service 
  isLoggedIn(): boolean {

    const access_token = sessionStorage.getItem("accessToken")
    if (access_token) {

      const decoded: any = jwtDecode(access_token)
      this.user = decoded
    }
    return !!access_token
  }
  
  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);

    console.log(this.isLoggedIn)
    
  }



  isMobileMenu(): boolean {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };

  logout(){
    sessionStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('noticeChoices')  
    localStorage.removeItem('cart')
    sessionStorage.removeItem('noticeCourses')
    this.router.navigate(['login'])

  }
  saveChoice(choice: string):void{
    localStorage.setItem('choice',choice)
  }
}
