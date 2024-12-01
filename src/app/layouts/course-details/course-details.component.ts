import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/Services/auth.service';
import { CourseService } from 'app/Services/course.service';
import { PopupService } from 'app/Services/popup.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements OnInit {

  constructor(private authService: AuthService, private popup: PopupService, private router: Router, private activatedRouter: ActivatedRoute, private courseService: CourseService) { }
  public isAdmin : boolean
  public isLearner: boolean
  public course: any = {}
  public error: boolean
  
  ngOnInit(): void {
    this.isLearner = this.authService.isLearner();
    this.isAdmin = this.authService.isAdminRole
    const courseId: string = this.activatedRouter.snapshot.params['id']
    this.courseService.getTheCourseById(courseId).subscribe({
      next: (res) => {
        if (res.status == 200) {

          this.course = res.body['data']
          console.log(this.course)
        }
      }, error: (err) => {
        if (err.status !== 200) {
          this.error = true

        }
      }
    })
  }


  getPricing(courseObj: any) {

    if (!this.authService.isUserLoggedIn   && !this.isLearner && !this.isAdmin) {
      this.popup.showNotification(
        'bottom',
        'right',
        'warning',
        'Please Login or Sign up as Student'
      );
      this.router.navigate(["login"])
      return
    }
    let courses: Array<any> = JSON.parse(localStorage.getItem('noticeCourses') || '[]');

    if (courses.some(course => course._id == courseObj._id)) {
      this.popup.showNotification(
        'bottom',
        'right',
        'warning',
        'Course is already Selected.'
      );
    } else {
      courses.push(courseObj);
      localStorage.setItem('noticeCourses', JSON.stringify(courses));
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
    if (!this.authService.isUserLoggedIn && !this.isLearner) {
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
    if (cart.some(service => service.course == id)) {
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



}
