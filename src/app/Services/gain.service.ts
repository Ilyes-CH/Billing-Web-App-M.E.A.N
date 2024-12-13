import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GainService {

  constructor(private http: HttpClient) { }
  private url: string = "http://127.0.0.1:3000/api";
  private token = sessionStorage.getItem('accessToken') || ""
  private httpHeaders = new HttpHeaders().set('Authorization',`Bearer ${this.token}`)


  getGains(){
   return this.http.get(`${this.url}/gains`,{observe:"response", headers:this.httpHeaders})
  }

  getPredictions(){
    return this.http.get(`${this.url}/predictions`,{observe:"response", headers:this.httpHeaders})
  }

}
