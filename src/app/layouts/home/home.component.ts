import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../Services/course.service';
import { FeedbackService } from 'app/Services/feedback.service';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../../app.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private courseService: CourseService,private feedbackService:FeedbackService) { }

  public feedbacks : Array<any> = []
  public noCourses: boolean = true
  public courses: Array<any>=[] 

  ngOnInit(): void {
    this.courseService.getAllCourses().subscribe((res) => {
      console.log(res)
      if (res.ok) {
        this.courses = res.body['data'].slice(0,3)
        this.noCourses = false
      } else if (res.status == 0) {
        console.log(this.noCourses)
      }
    })
  }

  fetchUserFeedBacks(){

  }

  isMobileMenu(): boolean {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };
}
