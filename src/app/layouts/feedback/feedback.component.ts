import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/Services/auth.service';
import { FeedbackService } from 'app/Services/feedback.service';
import { PopupService } from 'app/Services/popup.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  feedbackForm!: FormGroup;

  feedbackOptions = ['Positive', 'Negative'];
  topics = ['Course', 'Technical', 'Financial', 'Service'];

  constructor(private auth:AuthService,private fb: FormBuilder, private feedbackService: FeedbackService,private pop:PopupService) { }

  ngOnInit(): void {
    const id = this.auth.getId()
    console.log(id)
    // Initialize the form with validation
    this.feedbackForm = this.fb.group({
      commentorId:[id],
      type: ['', Validators.required], // Maps to "type" in the template
      subject: ['', Validators.required], // Maps to "subject" in the template
      comments: ['', [Validators.required, Validators.maxLength(500)]] // Maps to "comments"
    });
    
  }

  // Handle form submission
  onSubmit(): void {
    if (this.feedbackForm.valid) {
      console.log('Feedback Submitted:', this.feedbackForm.value);
        this.feedbackService.addFeedback(this.feedbackForm.value).subscribe({
          next:(res)=>{
              console.log(res)
              if(res.status ==201){
                this.pop.showNotification('bottom','right','success','Thank You For Your Feedback')
              }
          },error:(err)=>{
            console.log(err)
            if(err.status !== 201){
              this.pop.showNotification('bottom','right','danger','Error Submitting Your Feedback')

            }

          }
        })
    } else {
      console.log('Form is invalid');
    }
  }
}