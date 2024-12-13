import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }
  private url: string = 'http://127.0.0.1:3000/api/reports'
  private token = sessionStorage.getItem('accessToken') || ""
  private httpHeaders = new HttpHeaders().set('Authorization', `Bearer ${this.token}`)

  getReports() {
    return this.http.get(this.url, { observe: 'response', headers: this.httpHeaders })
  }

  getLatestReports() {
    return this.http.get(`${this.url}/latest`, { observe: 'response', headers: this.httpHeaders })

  }

  getReportById(id: string) {
    return this.http.get(`${this.url}/${id}`, { observe: 'response', headers: this.httpHeaders })
  }

  addNewReport(report: any) {
    return this.http.post(`${this.url}/newReport`, report, { observe: 'response', headers: this.httpHeaders })
  }

}
