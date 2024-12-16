import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth:AuthService,private http: HttpClient) { }
  
  
  // private  token = sessionStorage.getItem('accessToken') || ""
  private getToken():any{
    if(this.auth.isUserLoggedIn){

      return sessionStorage.getItem('accessToken')
    }
  }
  private tokenSubject = new BehaviorSubject<any>(this.getToken())
  token$ = this.tokenSubject.asObservable()
  private httpHeaders = new HttpHeaders().set("Authorization",`Bearer ${this.tokenSubject.getValue()}`)
  private url: string = "http://127.0.0.1:3000/api";

  login(credentials: any) {
    return this.http.post(`${this.url}/users/auth/login`, credentials, { observe: "response" })
  }

  signup(userObject: any, image: File) {
    const formData = new FormData()
    formData.append("img", image)
    formData.append("firstName", userObject.firstName)
    formData.append("lastName", userObject.lastName)
    formData.append("email", userObject.email)
    formData.append("phone", userObject.phone)
    formData.append("password", userObject.password)
    formData.append("role", userObject.role)
    formData.append("workId", userObject?.workId)
    formData.append("adminKey", userObject?.adminKey)
    formData.append("otp", userObject.otp)
    formData.append("country", userObject.country)
    formData.append("city", userObject.city)
    formData.append("zip", userObject.zip)
    return this.http.post(`${this.url}/users/auth/signup`, formData, { observe: 'response' })

  }

  verifyEmail(email: any) {
    return this.http.post(`${this.url}/auth/send-otp`, email, { observe: 'response' })
  }

  getUserById(userId: string) {
    return this.http.get(`${this.url}/users/${userId}`, { observe: 'response', headers:this.httpHeaders })
  }

  getUsers() {
    return this.http.get(`${this.url}/users`, { observe: 'response', headers:this.httpHeaders })

  }
  getDeletedUsers() {
    return this.http.get(`${this.url}/users/archivedUsers`, { headers:this.httpHeaders , observe: 'response'})
  }
  deleteUser(userId: string) {
    return this.http.delete(`${this.url}/users/${userId}`, { observe: 'response' , headers:this.httpHeaders})

  }

  deleteUsers() { 
    return this.http.delete(`${this.url}/users`, { observe: 'response' , headers:this.httpHeaders})

  }

  updateUser(userObject: any) { 
    return this.http.put(`${this.url}/users`,userObject ,{ observe: 'response' , headers:this.httpHeaders})

  }

  toggleStatus(userId: string){
    return this.http.get(`${this.url}/users/updateStatus/${userId}`, { observe: 'response', headers:this.httpHeaders })

  }
}
