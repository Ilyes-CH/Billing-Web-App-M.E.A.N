import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { UserService } from '../../Services/user.service';
import { Router } from '@angular/router';
import { CourseService } from 'app/Services/course.service';
import { OrderService } from 'app/Services/order.service';
import { GainService } from 'app/Services/gain.service';
import { jwtDecode } from 'jwt-decode';
import { StorageService } from 'app/Services/storage.service';
import { FormGroup } from '@angular/forms';
import { ReportService } from 'app/Services/report.service';
import { FeedbackService } from 'app/Services/feedback.service';
import { AuthService } from 'app/Services/auth.service';
import { PopupService } from 'app/Services/popup.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css', '../../app.component.css']
})
export class DashboardComponent implements OnInit {
  private gains: Array<any> = []
  private predictions: Array<any> = []
  startAnimationForLineChart(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function (data) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
  };
  startAnimationForBarChart(chart) {
    let seq2: any, delays2: any, durations2: any;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq2 = 0;
  };
  constructor(
    private router: Router,
    private feedbackService: FeedbackService,
    private reportService: ReportService,
    private popup: PopupService,
    private storage: StorageService,
    private gainService: GainService,
    private orderService: OrderService,
    private userService: UserService,
    private courseService: CourseService,
    private authservice: AuthService) { }

  public reportData: any = {}
  reportForm!: FormGroup
  public reports: Array<any> = []
  public activeUsers: Array<any> = []
  public inactiveUsers: Array<any> = []
  public courses: Array<any> = []
  public orders: Array<any> = []
  public students: Array<any> = []
  public revenue: number;
  public role: string
  public storageInfo: {}
  public feedBackCount: number = 0
  public date: number = 0
  public gainUpdatedAt: number = 0
  public dataDailySalesChart: any
  public dataCompletedTasksChart: any
  public dailySalesChart: any
  public completedTasksChart: any


  onClear() {
    this.reportData = {}
  }
  onSubmit() {
    const id = this.authservice.getId()
    this.reportData['accountantId'] = id
    console.log(this.reportData)
    this.reportService.addNewReport(this.reportData).subscribe({
      next: (res) => {
        console.log(res)
        if (res.status == 201) {
          this.onClear()
          this.popup.showNotification('bottom', 'right', 'success', 'Report was submitted Successfully')
        }
      }, error: (err) => {
        this.popup.showNotification('bottom', 'right', 'danger', 'Error Submitting the report')
        console.log(err)

      }
    })

  }
  viewOrder(path: string) {
    window.open(path)
  }
  deleteOrder(id: string) {
    this.orderService.removeOrder(id).subscribe({
      next: (res) => {
        if (res.status == 200) {
          this.popup.showNotification('bottom', 'right', 'success', 'Order was deleted Successfully')
          this.orderService.getAllOrders().subscribe((res) => {
            this.orders = res.body['data']
          })
        }
      }, error: (err) => {
        if (err.status != 200) {
          console.log(err)
          this.popup.showNotification('bottom', 'right', 'danger', 'Error Deleting the order')

        }
      }
    })
  }
  sum(arr: Array<any>) {
    let sum: number = 0;
    if (arr.length == 0) {
      return sum
    } else {
      for (let i = 0; i < arr.length; i++) {
        sum += arr[i]
      }
      return sum
    }
  }
  convertToGB(bytes: number): string {
    const gb = bytes / (1024 * 1024 * 1024); // Convert bytes to GB
    return `${gb.toFixed(0)}`; // Round to the nearest whole number and append "GB"
  }

  deleteCourse(id: string) {
    this.courseService.removeCourse(id).subscribe({
      next: (res) => {
        if (res.status == 200) {
          this.popup.showNotification('bottom', 'right', 'success', 'Course was deleted Successfully')

        }
      }, error: (err) => {
        if (err.status != 200) {
          this.popup.showNotification('bottom', 'right', 'danger', 'Error Deleting the Course')

        }
      }
    })
  }
  goToEditCourse(id: string) {
    this.router.navigate([`edit-course/${id}`])

  }
  goToCourseDetails(id: string) {
    this.router.navigate([`course-details/${id}`])
  }

  viewReport(id: string) {
    this.router.navigate([`reports/reportDetails/${id}`])
  }

  ngOnInit() {

    /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

    this.dataDailySalesChart = {
      labels: [],
      series: [
        []
      ]
    };

    const optionsDailySalesChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 100, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
    }


    this.dailySalesChart = new Chartist.Line('#dailySalesChart', this.dataDailySalesChart, optionsDailySalesChart);

    this.startAnimationForLineChart(this.dailySalesChart);

    /* ----------==========     Predictions initialization For Documentation    ==========---------- */
    // Chart initialization
    this.dataCompletedTasksChart = {
      labels: [],
      series: [[]]  // Ensure this is an array to hold the series data
    };

    const optionsCompletedTasksChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 100, // creative tim: we recommend you to set the high as the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 }
    };

    // Create the chart
    this.completedTasksChart = new Chartist.Line('#completedTasksChart', this.dataCompletedTasksChart, optionsCompletedTasksChart);

    // Start animation for the Completed Tasks Chart - Line Chart
    this.startAnimationForLineChart(this.completedTasksChart);




    this.storage.getStorage().subscribe((res) => {
      console.log(res)
      this.storageInfo = res
    })

    this.feedbackService.getFeedbackCount().subscribe({
      next: (res) => {
        if (res.status == 200) {
          console.log(res)
          this.feedBackCount = res.body['data']
          this.date = res.body['updatedAt']
        }
      }, error: (err) => {
        if (err.status !== 200) {
          this.feedBackCount = -1
        }
      }
    })


    this.reportService.getLatestReports().subscribe({
      next: (res) => {
        if (res.status === 200) {
          console.log('Reports: ', res.body['data'])
          this.reports = res.body['data']
        }
      }, error: (err) => {
        if (err.status !== 200) {
          this.reports = [{}]
        }
      }
    })



    const accessToken = sessionStorage.getItem('accessToken')
    if (accessToken) {
      const decoded = jwtDecode(accessToken)
      this.role = decoded['role']
    }

    this.getGainsChart()

    this.getPredictionsChart()



    /* ----------==========     Get Active Users and Unactive Users    ==========---------- */
    this.userService.getUsers().subscribe((res) => {
      if (res.status == 200) {
        this.activeUsers = res.body['data']
        this.students = this.activeUsers.filter((user) => user.role == 'Learner')
        console.log(this.activeUsers[0])
      } else if (res.status == 404) {

      }
    })
    this.userService.getDeletedUsers().subscribe((res) => {
      console.log(res)
      if (res.status == 200) {
        this.inactiveUsers = res.body['data']
        console.log(this.inactiveUsers)
      } else if (res.status == 404) {

      }
    })
    this.courseService.getCourses().subscribe((res) => {
      if (res.status == 200) {
        this.courses = res.body['data']
        console.log(this.courses)
      } else if (res.status == 404) {

      }
    })

    this.orderService.getAllOrders().subscribe((res) => {
      console.log(res)
      if (res.status == 200) {
        this.orders = res.body['data']
        console.log(this.orders[0].serviceIds[0].name)
      } else if (res.status == 404) {

      }
    })    /* ----------==========     Completed Tasks Chart initialization    ==========---------- */    /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

  }


  toggleStatus(id: string) {
    this.userService.toggleStatus(id).subscribe((res) => {
      console.log(res)
      if (res.ok) {
        this.userService.getUsers().subscribe((res) => {
          if (res.status == 200) {
            this.activeUsers = res.body['data']
            console.log(this.activeUsers)
          } else if (res.status == 404) {

          }
        })
      }
    })
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id).subscribe((res) => {
      console.log(res)
      if (res.ok) {
        this.userService.getUsers().subscribe((res) => {
          if (res.status == 200) {
            this.activeUsers = res.body['data']
            console.log(this.activeUsers)
          } else if (res.status == 404) {

          }
        })
      }
    })
  }

  getGainsChart() {
    this.gainService.getGains().subscribe({
      next: (res) => {
        console.log(res.body["data"])
        let gains = res.body['data'].map(g => g = g.total)
        this.gains = res.body['data'].map((gain) => ({
          total: Math.floor(gain.total) / 1000,
          date: new Date(gain.date).toLocaleDateString('en-US', { month: 'short' }),
        }))
        const labels = this.gains.map((gain) => gain.date);
        const series = [this.gains.map((gain) => gain.total)];
        console.log(labels)

        this.dailySalesChart.update({
          labels: labels,
          series: series,
        });

        this.gainUpdatedAt = res.body['data'][res.body['data'].length - 1]['date']
        console.log(this.gainUpdatedAt)
        this.revenue = this.sum(gains)
        console.log("gains: ", this.gains)
      }, error: (err) => {

      }
    })

  }

  getPredictionsChart() {
    this.gainService.getPredictions().subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.predictions = res.body['data'][0].predictions;
          this.predictions = this.predictions.map((p) => Math.floor(p) / 100)
          var labels = [new Date()];

          // Generate the next 6 months
          for (let i = 1; i <= 6; i++) {
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + i);
            labels.push(nextMonth);
          }

          // Format the labels as short month names
          const formattedLabels = labels.map((label) =>
            label.toLocaleDateString('en-US', { month: 'short' })
          );
          console.log("predictions", this.predictions)
          console.log('dates', formattedLabels)

          // Make sure you're updating the chart data correctly
          this.dataCompletedTasksChart.labels = formattedLabels;
          this.dataCompletedTasksChart.series = [this.predictions];  // Ensure predictions is wrapped in an array if it's a list of numbers

          // Update the chart with the new data
          this.completedTasksChart.update(this.dataCompletedTasksChart);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });

  }

}
