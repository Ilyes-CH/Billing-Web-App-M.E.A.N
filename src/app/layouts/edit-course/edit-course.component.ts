import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/Services/auth.service';
import { CourseService } from 'app/Services/course.service';
import { PopupService } from 'app/Services/popup.service';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss']
})
export class EditCourseComponent implements OnInit {

  constructor(private router: Router, private popup: PopupService, private auth: AuthService, private activatedRoute: ActivatedRoute, private courseService: CourseService) { }
  public course: any = {}
  public error: boolean
  public isLoading: boolean
  private isAdmin: boolean = false
  ngOnInit(): void {
    this.isAdmin = this.auth.isAdminRole
    this.error = null
    this.isLoading = true
    const id = this.activatedRoute.snapshot.params['id']
    if (this.isAdmin) {
      this.courseService.getCourseById(id).subscribe({
        next: (res) => {
          if (res.status == 200) {
            this.course = res.body['data']
            this.isLoading = false
            this.error = false
          }
        }, error: (err) => {
          if (err.status !== 200) {
            this.error = true

          }
        }
      })

    }
  }
  onSubmit(f: any) {
    console.log(this.course)
    this.courseService.updateCourse(this.course).subscribe({
      next: (res) => {
        if (res.status == 200) {
          console.log(res)
          this.popup.showNotification('bottom', 'right', 'success', 'Course Updated Successfully')
          this.router.navigate([`course-details/${this.course._id}`])
        }
      }, error: (err) => {
        if (err.status !== 200) {
          console.log(err)
          this.popup.showNotification('bottom', 'right', 'warning', 'Course Failed To Update')

        }
      }
    })
  }
  addPart() {
    this.course.details.courses.push({
      courseName: '',
      modules: [''],
    });
    this.course.details.parts += 1
  }
  removePart() {
    this.course.details.courses.pop()
    this.course.details.parts -= 1

  }

  // Remove a module
  removeModule(partIndex: number, moduleIndex: number) {
    this.course.details.courses[partIndex].modules.splice(moduleIndex, 1);
  }

  // Add a module to a specific part
  addModule(partIndex: number) {
    this.course.details.courses[partIndex].modules.push('');
  }
}
