import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient) { }
  private url: string = 'http://127.0.0.1:3000/api/feedback'

  getFeedbacks() {
    return this.http.get(this.url, { observe: 'response' })
  }
  
  getFeedbackCount(){
    return this.http.get(`${this.url}/count`, { observe: 'response' })

  }

  getUserFeedbacks(){
    return this.http.get(`${this.url}/feedbacks`, { observe: 'response' })

  }
  addFeedback(feedback: any) {
    return this.http.post(`${this.url}/newFeedBack`, feedback, { observe: 'response' })
  }

  removeFeedback(id:string){
    return this.http.delete(`${this.url}/${id}`,{observe:'response'})
  }
}
