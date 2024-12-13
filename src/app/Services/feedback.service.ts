import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient) { }
  private url: string = 'http://127.0.0.1:3000/api/feedback'
  private token = sessionStorage.getItem('accessToken') || ""
  private httpHeaders = new HttpHeaders().set('Authorization',`Bearer ${this.token}`)

  getFeedbacks() {
    return this.http.get(this.url, { observe: 'response', headers:this.httpHeaders })
  }
  
  getFeedbackCount(){
    return this.http.get(`${this.url}/count`, { observe: 'response', headers:this.httpHeaders })

  }

  getUserFeedbacks(){
    return this.http.get(`${this.url}/feedbacks`, { observe: 'response' })

  }
  addFeedback(feedback: any) {
    return this.http.post(`${this.url}/newFeedBack`, feedback, { observe: 'response', headers:this.httpHeaders })
  }

  removeFeedback(id:string){
    return this.http.delete(`${this.url}/${id}`,{observe:'response', headers:this.httpHeaders})
  }
}
