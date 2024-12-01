import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http: HttpClient) { }
  private URL: string = 'http://127.0.0.1:3000/api/news'

  getNews() {
    return this.http.get(this.URL, { observe: "response" })
  }
}
