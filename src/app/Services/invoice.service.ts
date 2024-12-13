import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }
  private url: string = "http://127.0.0.1:3000/api";
  private token = sessionStorage.getItem('accessToken') || ""
  private httpHeaders = new HttpHeaders().set('Authorization',`Bearer ${this.token}`)


  getInvoicesForCustomer(customerId:string) {
    return this.http.get(`${this.url}/invoices/${customerId}`, { observe: "response", headers:this.httpHeaders })

   }

  getInvoiceById(invoiceId: string) {
    return this.http.get(`${this.url}/invoices/invoice/${invoiceId}`, { observe: "response" , headers:this.httpHeaders})
  }

  getInvoices() {
    return this.http.get(`${this.url}/invoices`, { observe: "response" , headers:this.httpHeaders})

  }

  removeInvoice(invoiceId: string) {
    return this.http.delete(`${this.url}/invoices/${invoiceId}`, { observe: "response" , headers:this.httpHeaders})

  }

  removeInvoices() { 
    return this.http.delete(`${this.url}/invoices`, { observe: "response" , headers:this.httpHeaders})

  }


}
