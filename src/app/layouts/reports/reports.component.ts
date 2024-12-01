import { Component, OnInit } from '@angular/core';
import { ReportService } from 'app/Services/report.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  public reports: Array<any> = [];
  public error: boolean = false;
  public isLoading: boolean = true;
  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.fetchReports();

  }
  fetchReports(){
    this.reportService.getReports().subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.error = false;
          console.log(res)
          this.reports = res.body['data'];
        }
      },
      error: (err) => {
        console.error('Error fetching report details:', err);
        this.error = true;
      },
      complete: () => {
        this.isLoading = false; // Loading is complete
      },
    }); 
  }
}
