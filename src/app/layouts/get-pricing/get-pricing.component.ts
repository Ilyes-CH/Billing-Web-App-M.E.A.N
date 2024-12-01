import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { FormGroup } from '@angular/forms';
import { PopupService } from 'app/Services/popup.service';

@Component({
  selector: 'app-get-pricing',
  templateUrl: './get-pricing.component.html',
  styleUrls: ['./get-pricing.component.scss']
})
export class GetPricingComponent implements OnInit {
  public accountant: any = {};
  public getCourses: Array<any> = [];
  public accountants: Array<any> = [];
  private socket!: WebSocket;
  service !: FormGroup
  constructor(private userService: UserService, private popup:PopupService) {}

  ngOnInit(): void {
    // Fetch accountants
    this.userService.getUsers().subscribe((res) => {
      this.accountants = res.body['data'].filter((user) => user.role === 'Accountant');
      console.log(this.accountants);
    });

    // Load courses from local storage
    this.getCourses = JSON.parse(sessionStorage.getItem('noticeCourses') || '[]');
     this.getCourses.map((course)=>{
      
      course.quantity = 0
    })

    console.log(this.getCourses);
    
      
    // Initialize WebSocket
    const token = sessionStorage.getItem('accessToken');
    const port = 3000;
    if (token) {
      const wsUrl = `ws://127.0.0.1:${port}?token=${encodeURIComponent(token)}`;
      this.socket = new WebSocket(wsUrl, [token]);  // Send token as protocol

      this.socket.onopen = () => {
        console.log('Connected to WebSocket server.');
      };

      this.socket.onmessage = (event) => {
        console.log('Message received from server:', event.data);
      };

      this.socket.onclose = () => {
        console.log('Disconnected from WebSocket server.');
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } else {
      console.error('Access token not found. WebSocket connection aborted.');
    }
  
  }

  delete(id: string): void {
    this.getCourses = this.getCourses.filter((course) => id !== course._id);
    sessionStorage.setItem('noticeCourses', JSON.stringify(this.getCourses));
  }

  submitNotice(): void {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('Access token is missing. Cannot submit notice.');
      return;
    }

    // console.log(this.accountant, this.getCourses, accessToken);
      const serviceIds = this.getCourses.map((course)=> course = course._id) 
    const quantities = this.getCourses.map(course => course.quantity);

    if (this.accountant.id && this.getCourses.length > 0) {
      this.createCart()

      this.sendRequest(this.accountant.id, serviceIds,quantities);
      this.popup.showNotification('bottom','right','success','Notice request Sent Successfully, You will receive your notice in an Email, ASAP')
    } else {
      console.error('Invalid accountant or no courses selected.');
      this.popup.showNotification('bottom','right','warning','Notice request Was Not Sent, Please try again')

    }
  }

  createCart(){
    const servicesId = this.getCourses.map((course)=>({
      course : course._id,
      quantity: course.quantity,
      creationDate: Date.now()
    }))
  localStorage.setItem('cart',JSON.stringify(servicesId))
  }
  sendRequest(accountantId: string, serviceIds: Array<any>, quantities: Array<any>): void {
    

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = {
        type: 'message',
        accountantId, // ID of the selected agent
        serviceIds,
        quantities,
        content: 'Requesting price for the service.'
      };
      this.socket.send(JSON.stringify(message));
      console.log('Request sent:', message);
    } else {
      console.error('WebSocket is not open. Cannot send the request.');
    }
  }
}
