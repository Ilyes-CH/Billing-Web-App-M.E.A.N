import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { OrderService } from 'app/Services/order.service';
import { PopupService } from 'app/Services/popup.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent implements OnInit {
  public error: boolean
  public role: string
  private userId: string
  private orderObj: any = {}
  private isFound: boolean
  public result = []
  public orders: Array<any> = []
  public searchForm!: FormGroup

  constructor(private order: OrderService, private popup: PopupService) { }

  ngOnInit(): void {
    const accessToken = sessionStorage.getItem('accessToken')
    if (accessToken) {
      const decoded = jwtDecode(accessToken)
      console.log(decoded)
      this.role = decoded['role']
      this.userId = decoded['id']
      if (decoded && decoded['role'] !== null && decoded['role'] == "Learner") {

        this.order.getOrderByCustomerId(decoded['id']).subscribe({
          next: (res) => {
            console.log(res)
            if (res.ok) {
              this.error = false
              this.orders = res.body['data'].reverse()
              this.result = this.orders

            }
          },
          error: (err) => {
            this.error = true
            console.log(err)
          }
        })
      } else {
        this.order.getAllOrders().subscribe({
          next: (res) => {
            if (res.status == 200) {
              this.error = false
              this.orders = res.body['data'].reverse()
              this.result = this.orders
            }
          }, error: (err) => {
            if (err.status !== 200) {
              this.error = true
              console.log(err)
            }
          }
        })
      }
    }
  }
  open(link: string) {
    window.open(link)
  }
  deleteOrder(id: string) {
    this.order.removeOrder(id).subscribe({
      next: (res) => {
        if (res.status == 200) {
          if (this.role == "Learner") {

            this.order.getOrderByCustomerId(this.userId).subscribe({
              next: (res) => {
                console.log(res)
                if (res.status == 200) {
                  this.error = false
                  this.orders = res.body['data']
                  this.popup.showNotification('bottom', 'right', 'success', 'Order Was Deleted With Success')
                }
              }, error: (err) => {
                this.error = true

                console.log(err)
              }
            })
          }
          else {
            this.order.getAllOrders().subscribe({
              next: (res) => {
                console.log(res)
                if (res.status == 200) {
                  this.error = false
                  this.orders = res.body['data']
                  this.popup.showNotification('bottom', 'right', 'success', 'Order Was Deleted With Success')

                }
              }, error: (err) => {
                this.error = true
                console.log(err)
              }
            })

          }
        }
      }, error: (err) => {
        this.popup.showNotification('bottom', 'right', 'danger', 'Error Deleting the Order')


      }
    })
  }

  searchIn(input: string) {
    console.log(input)
    if(input.trim() == ''){
      this.result = [...this.orders]
      this.isFound = true
    }else{
      
      this.result = this.orders.filter((obj:any) => {
        return obj.total == this.orderObj.total
      })
      console.log(this.result)
      this.result.length == 0 ? this.isFound = false : this.isFound = true
    }
    }
}

