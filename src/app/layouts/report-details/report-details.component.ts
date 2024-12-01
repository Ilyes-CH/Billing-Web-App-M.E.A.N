import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from 'app/Services/report.service';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.scss'],
})
export class ReportDetailsComponent implements OnInit {
  public report: any = {};
  public error: boolean = false;
  public isLoading: boolean = true; 

  constructor(
    private activatedRoute: ActivatedRoute,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.fetchReportDetails(id);
  }

  // Fetch report details by ID
  private fetchReportDetails(id: string): void {
    this.reportService.getReportById(id).subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.error = false;
          console.log(res)
          this.report = res.body['data'];
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
