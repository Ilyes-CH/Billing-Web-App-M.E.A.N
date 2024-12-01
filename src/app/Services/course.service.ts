import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) { }

  private url: string = "http://127.0.0.1:3000/api";

  addCourse(courseObject: any, image: File) {
    const formData = new FormData()
    const details = {
      parts : courseObject.parts,
      duration: courseObject.duration,
      courses : courseObject.courses
    }
    formData.append("img", image)
    formData.append("name", courseObject.name)
    formData.append("priceHT", courseObject.priceHT)
    formData.append("details", JSON.stringify(details))
    return this.http.post(`${this.url}/services`, formData, { observe: "response" })

  }

  removeCourse(courseId: string) {
    return this.http.delete(`${this.url}/services/${courseId}`, { observe: 'response' })
  }

  removeCourses() {
    return this.http.delete(`${this.url}/services/`, { observe: 'response' })
  }

  getCourseById(courseId: string) {
    return this.http.get(`${this.url}/services/service/${courseId}`, { observe: 'response' })

  }
  //without pricing
  getTheCourseById(courseId: string) {
    return this.http.get(`${this.url}/services/service/course/${courseId}`, { observe: 'response' })

  }


  getAllCourses() {
    //without pricing
    return this.http.get(`${this.url}/services`, { observe: 'response' })

  }
  getCourses() {
    return this.http.get(`${this.url}/services/allCourses`, { observe: 'response' })

  }


  updateCourse(courseObject: any) {
    return this.http.put(`${this.url}/services`, courseObject,{ observe: 'response' })

  }
}
