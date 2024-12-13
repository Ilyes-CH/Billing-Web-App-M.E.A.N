import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {

  constructor(private http: HttpClient) { }
  private url: string = "http://127.0.0.1:3000/api";
  private token = sessionStorage.getItem('accessToken') || ""
  private httpHeaders = new HttpHeaders().set('Authorization',`Bearer ${this.token}`)

  addNotice(noticeObject: string) {
    return this.http.post(`${this.url}/notices/addNotice`, noticeObject, { observe: 'response', headers:this.httpHeaders })
  }

  getNotices() {
    return this.http.get(`${this.url}/notices`, { observe: 'response', headers:this.httpHeaders })
  }

  deleteNotice(noticeId: string) {
    return this.http.delete(`${this.url}/notices/${noticeId}`, { observe: "response", headers:this.httpHeaders })
  }

  getNoticeByCustomerId(customerId: string) {
    return this.http.get(`${this.url}/notices/customer/${customerId}`,{observe:"response", headers:this.httpHeaders})
  }

  getNotice(noticeId: string) {
    return this.http.get(`${this.url}/notice/${noticeId}`,{observe:"response", headers:this.httpHeaders})
  }

}
