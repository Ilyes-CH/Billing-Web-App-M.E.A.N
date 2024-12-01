import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {

  constructor(private http: HttpClient) { }
  private url: string = "http://127.0.0.1:3000/api";

  addNotice(noticeObject: string) {
    return this.http.post(`${this.url}/notices/addNotice`, noticeObject, { observe: 'response' })
  }

  getNotices() {
    return this.http.get(`${this.url}/notices`, { observe: 'response' })
  }

  deleteNotice(noticeId: string) {
    return this.http.delete(`${this.url}/notices/${noticeId}`, { observe: "response" })
  }

  getNoticeByCustomerId(customerId: string) {
    return this.http.get(`${this.url}/notices/customer/${customerId}`,{observe:"response"})
  }

  getNotice(noticeId: string) {
    return this.http.get(`${this.url}/notice/${noticeId}`,{observe:"response"})
  }

}
