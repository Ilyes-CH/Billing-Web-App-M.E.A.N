import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NoticeService } from 'app/Services/notice.service';
import { PopupService } from 'app/Services/popup.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-notices',
  templateUrl: './notices.component.html',
  styleUrls: ['./notices.component.scss', '../../app.component.css']
})
export class NoticesComponent implements OnInit {

  constructor(private noticeService: NoticeService, private popup: PopupService) { }
  public error: boolean
  public role: string
  private userId: string
  private noticeObj: any = {}
  private isFound:boolean
  public result = []
  public notices: Array<any> = [];
  public searchForm!: FormGroup
  ngOnInit(): void {

    const accessToken = sessionStorage.getItem('accessToken')
    if (accessToken) {
      const decoded = jwtDecode(accessToken)
      this.role = decoded['role']
      this.userId = decoded['id']
      if (decoded && decoded['role'] !== null && decoded['role'] == "Learner") {

        this.noticeService.getNoticeByCustomerId(decoded['id']).subscribe({
          next: (res) => {
            console.log(res)
            if (res.status == 200) {
              this.error = false
              this.notices = res.body['data']
              this.result = this.notices
            }
          }, error: (err) => {
            this.error = true
            console.log(err)
          }
        })
      }
      else {
        this.noticeService.getNotices().subscribe({
          next: (res) => {
            console.log(res)
            if (res.status == 200) {
              this.error = false
              this.notices = res.body['data']
            this.result = this.notices

            }
          }, error: (err) => {
            this.error = true

            console.log(err)
          }
        })
      }
    }

  }
  open(link: string) {
    window.open(link)
  }
  deleteNotice(id: string) {
    this.noticeService.deleteNotice(id).subscribe({
      next: (res) => {
        if (res.status == 200) {
          if (this.role == "Learner") {

            this.noticeService.getNoticeByCustomerId(this.userId).subscribe({
              next: (res) => {
                console.log(res)
                if (res.status == 200) {
                  this.error = false
                  this.notices = res.body['data']
                  this.popup.showNotification('bottom', 'right', 'success', 'Notice Was Deleted With Success')
                }
              }, error: (err) => {
                this.error = true

                console.log(err)
              }
            })
          }
          else {
            this.noticeService.getNotices().subscribe({
              next: (res) => {
                console.log(res)
                if (res.status == 200) {
                  this.error = false
                  this.notices = res.body['data']
                  this.popup.showNotification('bottom', 'right', 'success', 'Notice Was Deleted With Success')

                }
              }, error: (err) => {
                this.error = true
                console.log(err)
              }
            })

          }
        }
      }, error: (err) => {
        this.popup.showNotification('bottom', 'right', 'danger', 'Error Deleting the Notice')


      }
    })
  }

  searchIn(input: string) {
  console.log(input)
  if(input.trim() == ''){
    this.result = [...this.notices]
    this.isFound = true
  }else{
    
    this.result = this.notices.filter((obj:any) => {
      return obj.total == this.noticeObj.total
    })
    console.log(this.result)
    this.result.length == 0 ? this.isFound = false : this.isFound = true
  }
  }
}
