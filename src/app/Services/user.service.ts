import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

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
    return this.http.get(`${this.url}/users/${userId}`, { observe: 'response' })
  }

  getUsers() {
    return this.http.get(`${this.url}/users`, { observe: 'response' })

  }
  getDeletedUsers() {
    return this.http.get(`${this.url}/users/archivedUsers`, { observe: 'response' })

  }
  deleteUser(userId: string) {
    return this.http.delete(`${this.url}/users/${userId}`, { observe: 'response' })

  }

  deleteUsers() { 
    return this.http.delete(`${this.url}/users`, { observe: 'response' })

  }

  updateUser(userObject: any) { 
    return this.http.put(`${this.url}/users`,userObject ,{ observe: 'response' })

  }

  toggleStatus(userId: string){
    return this.http.get(`${this.url}/users/updateStatus/${userId}`, { observe: 'response' })

  }
}
