import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }
  private url: string = "http://127.0.0.1:3000/api";

  getInvoicesForCustomer(customerId:string) {
    return this.http.get(`${this.url}/invoices/${customerId}`, { observe: "response" })

   }

  getInvoiceById(invoiceId: string) {
    return this.http.get(`${this.url}/invoices/invoice/${invoiceId}`, { observe: "response" })
  }

  getInvoices() {
    return this.http.get(`${this.url}/invoices`, { observe: "response" })

  }

  removeInvoice(invoiceId: string) {
    return this.http.delete(`${this.url}/invoices/${invoiceId}`, { observe: "response" })

  }

  removeInvoices() { 
    return this.http.delete(`${this.url}/invoices`, { observe: "response" })

  }


}
