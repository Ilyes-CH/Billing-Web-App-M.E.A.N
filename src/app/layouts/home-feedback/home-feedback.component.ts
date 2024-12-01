import { Component, OnInit } from '@angular/core';
import { FeedbackService } from 'app/Services/feedback.service';

@Component({
  selector: 'app-home-feedback',
  templateUrl: './home-feedback.component.html',
  styleUrls: ['./home-feedback.component.scss']
})
export class HomeFeedbackComponent implements OnInit {
  public error: boolean = false;
  public isLoading: boolean = true;
  public testimonials: Array<any> = []
  constructor(private feedbackService:FeedbackService) { }
  ngOnInit(): void {

  this.fetchFeedbacks()
  }
fetchFeedbacks(){
  this.feedbackService.getUserFeedbacks().subscribe({
    next: (res) => {
      if (res.status === 200) {
        this.error = false;
        console.log(res)
        this.testimonials = res.body['data'];
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

}
