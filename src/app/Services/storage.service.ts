import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private http: HttpClient) { }
  private token = sessionStorage.getItem('accessToken') || ""
  private httpHeaders = new HttpHeaders().set('Authorization', `Bearer ${this.token}`)

  getStorage() {
    return this.http.get('http://127.0.0.1:3000/api/df/disk-info', { observe: 'response', headers: this.httpHeaders })
  }
}
