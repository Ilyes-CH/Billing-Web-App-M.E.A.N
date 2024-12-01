import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseService } from 'app/Services/course.service';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private courseService: CourseService, private router: Router) { }
  addCourse!: FormGroup
  courseImage: File
  ngOnInit(): void {
    this.addCourse = this.formBuilder.group({
      name: ['', []],
      priceHT: ['', []],
      duration: ['', []],
      parts: [, []],
      courses: this.formBuilder.array([])

    })
  }
  get courses(): FormArray {
    return this.addCourse.get('courses') as FormArray;
  }
  // Method to add a new course FormGroup to the courses array
  addCourseField(): void {
    const courseGroup = this.formBuilder.group({
      courseName: ['', []],
      modules: this.formBuilder.array([]) // Initialize modules FormArray
    });
    this.courses.push(courseGroup);
  }
  // Method to add a new module to a specific course
  addModuleField(courseIndex: number): void {
    const modules = this.courses.at(courseIndex).get('modules') as FormArray;
    modules.push(new FormControl('')); // Add new FormControl for module
  }


  submitCourse() {
    console.log(this.addCourse.value)
    this.courseService.addCourse(this.addCourse.value, this.courseImage).subscribe((res)=>{
      console.log(res)
      if(res.ok){
        this.router.navigate(['courses'])
      }
    })
  }

  getCourseImage(event: Event) {
    const inputElement = event.target as HTMLInputElement

    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      this.courseImage = inputElement.files[0]
    }
  }
}
