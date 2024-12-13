import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http : HttpClient) { }

  private url: string = "http://127.0.0.1:3000/api";
  private token = sessionStorage.getItem('accessToken') || ""
  private httpHeaders = new HttpHeaders().set('Authorization',`Bearer ${this.token}`)

  addOrder(orderObject: any) {
  
    return this.http.post(`${this.url}/orders/addOrder`, orderObject, { observe: "response",  headers:this.httpHeaders })

  }

  removeOrder(orderId: string) {
    return this.http.delete(`${this.url}/orders/order/${orderId}`, { observe: 'response',  headers:this.httpHeaders })
  }

  removeOrders() {
    return this.http.delete(`${this.url}/orders/`, { observe: 'response' ,  headers:this.httpHeaders})
  }

  getOrderById(orderId: string) {
    return this.http.get(`${this.url}/orders/order/${orderId}`, { observe: 'response',  headers:this.httpHeaders })

  }


  getOrderByCustomerId(customerId: string) {
    return this.http.get(`${this.url}/orders/${customerId}`, { observe: 'response',  headers:this.httpHeaders })

  }

  getAllOrders() {
    return this.http.get(`${this.url}/orders`, { observe: 'response' ,  headers:this.httpHeaders})

  }


}
