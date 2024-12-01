import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/Services/auth.service';
import { CourseService } from 'app/Services/course.service';
import { PopupService } from 'app/Services/popup.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

  constructor(private router: Router, private popup: PopupService,private authService: AuthService) { }
  public isLearner: boolean
  @Input() course: any = {}
  ngOnInit(): void {
    this.refreshAuthState();
  }

  refreshAuthState(): void {
    this.isLearner = this.authService.isLearner();
    console.log(this.authService.isUserLoggedIn)
    // console.log(this.isLearner, this.isLoggedIn, this.user);
  }
  getPricing(courseObj: any) {
    this.refreshAuthState();

    if(!this.authService.isUserLoggedIn && !this.isLearner){
      this.popup.showNotification(
        'bottom',
        'right',
        'warning',
        'Please Login or Sign up as Student'
      );
      this.router.navigate(["login"])
      return  
    }
    let courses: Array<any> = JSON.parse(sessionStorage.getItem('noticeCourses') || '[]');

    if (courses.some(course => course._id == courseObj._id)) {
      this.popup.showNotification(
        'bottom',
        'right',
        'warning',
        'Course is already Selected.'
      );
    } else {
      courses.push(courseObj);
      sessionStorage.setItem('noticeCourses', JSON.stringify(courses));
      console.log(courses);
      this.popup.showNotification(
        'bottom',
        'right',
        'success',
        'Course is added to Get Pricing pull and basket. Please go to the pricing page to submit your request or select other services for the pricing request.'
      );
    }
  }
  addToCart(id: string) {
    if(!this.authService.isUserLoggedIn && !this.isLearner){
      this.popup.showNotification(
        'bottom',
        'right',
        'warning',
        'Please Login or Sign up as Student'
      );
      this.router.navigate(["login"])
      return  
    }
    let cart: Array<any> = JSON.parse(localStorage.getItem('cart') || '[]')
    if (cart.some(service => service.course == id)){
      this.popup.showNotification(
        'bottom',
        'right',
        'warning',
        'Course is already Added to the cart.'
      );
      return
    } else {

      var cartObj = { course: id, quantity: 0, creationDate: Date.now() }
      cart.push(cartObj)
      localStorage.setItem('cart', JSON.stringify(cart))
      this.popup.showNotification(
        'bottom',
        'right',
        'success',
        'Course is Added to the cart Successfully.'
      );
    }
  }


  getCourseDetails(id: string) {
    if(!this.authService.isUserLoggedIn ){
      this.popup.showNotification(
        'bottom',
        'right',
        'warning',
        'Please Login or Sign up as Student'
      );
      this.router.navigate(["login"])
      return  
    }
    this.router.navigate([`course-details/${id}`]);
  }
}
