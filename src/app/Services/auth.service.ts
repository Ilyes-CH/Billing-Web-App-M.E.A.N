import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  private url: string = "http://127.0.0.1:3000/api";
  private accessToken = sessionStorage.getItem('accessToken')
  private headers = new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`)
  public isAdmin : boolean = false
  public isAccountant : boolean = false
  //dynamically get notifications from LS
  private notificationsSubject = new BehaviorSubject<any[]>(this.getNotificationsFromLocalStorage());
  notifications$ = this.notificationsSubject.asObservable();

  private getNotificationsFromLocalStorage(): any[] {
    return JSON.parse(localStorage.getItem('notifications') || '[]');
  }


  set setNotifications(notif: any) {
    localStorage.setItem('notifications', JSON.stringify(notif));
    this.notificationsSubject.next(notif);
  }
  get notifications() {
    return this.notificationsSubject.getValue();
  }
  
  
  
  get isUserLoggedIn(): boolean {
    return !!sessionStorage.getItem('accessToken');
  }
 
  set adminRole(val: boolean) {
    this.isAdmin = val;
  }
  
  
  get isAdminRole(): boolean {
    return JSON.parse(localStorage.getItem('adminRole') || 'false');

  }

  set accountantRole(val:boolean){
    this.isAccountant = val
  }

  get isAccountantRole(): boolean {
    return JSON.parse(localStorage.getItem('accountantRole') || 'false');

  }
  
  
  isLearner(): boolean {
    if (this.accessToken) {
      const decoded = jwtDecode(this.accessToken)
      if (decoded['role'] == "Learner") {
        return true
      }
      return false
    }
    return false
  }

  //set and get the isAdmin 

  getId() {
    if (this.accessToken) {
      const decoded = jwtDecode(this.accessToken)
      return decoded['id']
    }
  }
  checkAdmin() {
    return this.http.get(`${this.url}/checkAdmin`, { observe: 'response' })
  }

  verifyToken() {
    return this.http.get<{ message: string }>("http://localhost:3000/api/verifyToken", { headers: this.headers })
  }


  resetPassword(userObj: any) {
    return this.http.post(`${this.url}/reset/reset-password/${userObj.code}`, userObj, { observe: "response" })
  }

  verifyIdentity(emailObj: any) {
    return this.http.post(`${this.url}/reset/one-time-code`, emailObj, { observe: 'response' })
  }

  verifyOtpToken(token: string) {
    return this.http.get(`${this.url}/reset/verify/${token}`, { observe: 'response' })
  }

  isExpired(): any {
    if (this.accessToken) {

      const decoded = jwtDecode(this.accessToken)
      if (decoded.exp) {
        const currentTime = Math.floor(Date.now() / 1000)
        if (decoded.exp < currentTime) {
          return true
        } else {
          return false
        }
      }
    }
  }
}
