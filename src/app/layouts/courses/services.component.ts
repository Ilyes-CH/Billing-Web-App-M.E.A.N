import { Component, OnInit } from '@angular/core';
import { CourseService } from 'app/Services/course.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  constructor(private courseService : CourseService) { }

  public courses : Array<any> = [];

  ngOnInit(): void {
    this.courseService.getAllCourses().subscribe((res)=>{
      if(res.ok){
        this.courses = res.body['data']
      }
    })
  }

}
