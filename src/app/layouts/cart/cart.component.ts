import { Component, OnInit } from '@angular/core'; import { Router } from '@angular/router';
import { CourseService } from 'app/Services/course.service';
import { OrderService } from 'app/Services/order.service';
import { PopupService } from 'app/Services/popup.service';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  public cart: Array<any> = []
  public isCartFull: boolean
  public cartCourses: Array<any> = []
  constructor(
    private courseService: CourseService,
    private orderService: OrderService,
    private popup: PopupService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // get cart  
    this.cart = JSON.parse(localStorage.getItem('cart') || "[]")
    const oneHour = 3600000
    const lastCreatedTime = this.cart[this.cart.length - 1]
    const elaplsedTime = Date.now() - new Date(lastCreatedTime.creationDate).getTime()

    if (elaplsedTime > oneHour) {
      console.log('More than one hour has passed since the last cart item was created.');
      this.cart = []
      localStorage.setItem('cart',JSON.stringify(this.cart))
      // Perform the necessary action, e.g., remove the item or notify the user
    } else {
      console.log('Less than one hour since the last cart item was created.');
    }
    // get courses from db
   
    if (this.cart.length > 0) {

      this.isCartFull = false
      this.cart.forEach(service => {
        this.courseService.getTheCourseById(service.course).subscribe((res) => {
          if (res.ok) {
            this.cartCourses.push(res.body['data'])
          }

        })

      });


    } else {
      this.isCartFull = true


    }
    

  }
  removeFromCart(id: string): void {
    this.cart = this.cart.filter((service) => service.course !== id)
    localStorage.setItem('cart', JSON.stringify(this.cart))
    this.cartCourses = this.cartCourses.filter(course => course._id !== id);

  }

  placeOrder() {
    const accessToken = sessionStorage.getItem('accessToken') || ''
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken)
      const orderObj = {
        studentId: decodedToken['id'],
        servicesIds: this.cart.map(service => service = service.course),
        quantity: this.cart.map(service => service = service.quantity),
      }
      console.log(orderObj)
      if(orderObj.quantity.filter(q => q == 0 ).length > 0){
       return this.popup.showNotification("bottom", "left", "danger", "Please Add Quantity")

      }
      this.orderService.addOrder(orderObj).subscribe({
        next: (res) => {
          if (res.ok) {
            console.log(res)
            this.popup.showNotification("bottom", "left", "success", "Order Placed Successfully")
            this.router.navigate(['purchases'])
          }
        }, error: (err) => {
          console.log(err)
          this.popup.showNotification("bottom", "left", "danger", "A Notice Must Be Created For This Order, Matching All Respective Details")

        }
      })

    }
  }


}
