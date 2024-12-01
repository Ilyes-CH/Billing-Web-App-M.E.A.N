import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private http:HttpClient) { }

  getStorage(){
    return this.http.get('http://127.0.0.1:3000/api/df/disk-info')
  }
}
