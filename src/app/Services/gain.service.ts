import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GainService {

  constructor(private http: HttpClient) { }
  private url: string = "http://127.0.0.1:3000/api";
  

  getGains(){
   return this.http.get(`${this.url}/gains`,{observe:"response"})
  }

  getPredictions(){
    return this.http.get(`${this.url}/predictions`,{observe:"response"})
  }

}
