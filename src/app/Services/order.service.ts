import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http : HttpClient) { }

  private url: string = "http://127.0.0.1:3000/api";

  addOrder(orderObject: any) {
  
    return this.http.post(`${this.url}/orders/addOrder`, orderObject, { observe: "response" })

  }

  removeOrder(orderId: string) {
    return this.http.delete(`${this.url}/orders/order/${orderId}`, { observe: 'response' })
  }

  removeOrders() {
    return this.http.delete(`${this.url}/orders/`, { observe: 'response' })
  }

  getOrderById(orderId: string) {
    return this.http.get(`${this.url}/orders/order/${orderId}`, { observe: 'response' })

  }


  getOrderByCustomerId(customerId: string) {
    return this.http.get(`${this.url}/orders/${customerId}`, { observe: 'response' })

  }

  getAllOrders() {
    return this.http.get(`${this.url}/orders`, { observe: 'response' })

  }


}
