import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) { }

  private url: string = "http://127.0.0.1:3000/api";

  private token = sessionStorage.getItem('accessToken') || ""
  private httpHeaders = new HttpHeaders().set('Authorization',`Bearer ${this.token}`)

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
    return this.http.post(`${this.url}/services`, formData, { observe: "response", headers:this.httpHeaders })

  }

  removeCourse(courseId: string) {
    return this.http.delete(`${this.url}/services/${courseId}`, { observe: 'response', headers:this.httpHeaders })
  }

  removeCourses() {
    return this.http.delete(`${this.url}/services/`, { observe: 'response', headers:this.httpHeaders })
  }

  getCourseById(courseId: string) {
    return this.http.get(`${this.url}/services/service/${courseId}`, { observe: 'response', headers:this.httpHeaders })

  }
  //without pricing
  getTheCourseById(courseId: string) {
    return this.http.get(`${this.url}/services/service/course/${courseId}`, { observe: 'response', headers:this.httpHeaders })

  }


  getAllCourses() {
    //without pricing
    return this.http.get(`${this.url}/services`, { observe: 'response' })

  }
  getCourses() {
    return this.http.get(`${this.url}/services/allCourses`, { observe: 'response', headers:this.httpHeaders })

  }


  updateCourse(courseObject: any) {
    return this.http.put(`${this.url}/services`, courseObject,{ observe: 'response', headers:this.httpHeaders })

  }
}
