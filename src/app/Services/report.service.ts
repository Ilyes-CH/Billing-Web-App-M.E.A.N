import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }
  private url: string = 'http://127.0.0.1:3000/api/reports'

  getReports() {
    return this.http.get(this.url, { observe: 'response' })
  }

  getLatestReports(){
    return this.http.get(`${this.url}/latest`, { observe: 'response' })

  }

  getReportById(id: string) {
    return this.http.get(`${this.url}/${id}`, { observe: 'response' })
  }

  addNewReport(report: any) {
    return this.http.post(`${this.url}/newReport`, report, { observe: 'response' })
  }

}
