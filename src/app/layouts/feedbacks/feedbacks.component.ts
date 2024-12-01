import { Component, OnInit } from '@angular/core';
import { FeedbackService } from 'app/Services/feedback.service';
import { PopupService } from 'app/Services/popup.service';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.scss']
})
export class FeedbacksComponent implements OnInit {
  public feedbacks: Array<any> = [];
  public error: boolean = false;
  public isLoading: boolean = true;
  constructor(private popup: PopupService, private feedbackService: FeedbackService) { }

  ngOnInit(): void {
    this.fetchFeedBacks()
  }
  fetchFeedBacks() {
    this.feedbackService.getFeedbacks().subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.error = false;
          console.log(res)
          this.feedbacks = res.body['data'];
        }
      },
      error: (err) => {
        console.error('Error fetching feedbacks details:', err);
        this.error = true;
      },
      complete: () => {
        this.isLoading = false; // Loading is complete
      },
    });
  }
  deleteFeedback(id: string) {
    this.feedbackService.removeFeedback(id).subscribe({
      next: (res) => {
        console.log(res)
        if(res.status == 200){
          this.popup.showNotification('bottom','right','success','feedback deleted ')
          this.feedbackService.getFeedbacks().subscribe((res)=>{
          this.error = false;
            this.feedbacks = res.body['data']
          })
        }
      }, error: (err) => {
        console.log(err)
        if(err.status != 200){
          this.popup.showNotification('bottom','right','danger','error deleting feedback ')

        }
      }
    })
  }
}
