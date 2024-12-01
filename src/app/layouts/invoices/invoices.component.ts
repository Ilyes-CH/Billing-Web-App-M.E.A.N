import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InvoiceService } from 'app/Services/invoice.service';
import { PopupService } from 'app/Services/popup.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {
  public error: boolean
  public role: string
  private userId: string
  private invoiceObj: any = {}
  private isFound: boolean
  public result: Array<any> = []
  public invoices: Array<any> = []
  public searchForm!: FormGroup
  constructor(private invoiceService: InvoiceService, private popup: PopupService) { }

  ngOnInit(): void {

    const accessToken = sessionStorage.getItem('accessToken')
    if (accessToken) {
      const decoded = jwtDecode(accessToken)
      this.role = decoded['role']
      this.userId = decoded['id']
      if (decoded && decoded['role'] !== null && decoded['role'] == "Learner") {

        this.invoiceService.getInvoicesForCustomer(decoded['id']).subscribe({
          next: (res) => {
            this.error = false
            this.invoices = res.body['data']
            this.result = this.invoices
            console.log(this.invoices)
          }, error: (err) => {
            console.log(err)
            this.error = true

          }
        })
      }
      else {
        this.invoiceService.getInvoices().subscribe({
          next: (res) => {
            this.error = false
            this.invoices = res.body['data']
            console.log(this.invoices)
            this.result = this.invoices
            console.log(this.invoices)
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
  removeInvoice(id: string) {
    this.invoiceService.removeInvoice(id).subscribe({
      next: (res) => {
        if (res.status == 200) {
          if (this.role == "Learner") {

            this.invoiceService.getInvoicesForCustomer(this.userId).subscribe({
              next: (res) => {
                console.log(res)
                if (res.status == 200) {
                  this.error = false
                  this.invoices = res.body['data']
                  this.popup.showNotification('bottom', 'right', 'success', 'Invoice Was Deleted With Success')
                }
              }, error: (err) => {
                this.error = true

                console.log(err)
              }
            })
          }
          else {
            this.invoiceService.getInvoices().subscribe({
              next: (res) => {
                console.log(res)
                if (res.status == 200) {
                  this.error = false
                  this.invoices = res.body['data']
                  this.popup.showNotification('bottom', 'right', 'success', 'Invoice Was Deleted With Success')

                }
              }, error: (err) => {
                this.error = true
                console.log(err)
              }
            })

          }
        }
      }, error: (err) => {
        this.popup.showNotification('bottom', 'right', 'danger', 'Error Deleting the Invoice')


      }
    })
  }

  searchIn(input: string) {
    console.log(input);

    const trimmedInput = input.trim().toLowerCase();

    if (trimmedInput === '') {
      this.result = [...this.invoices];
      this.isFound = true;
    } else {
      // Search by phone number and last name
      this.result = this.invoices.filter((invoice: any) => {
        const customer = invoice.customerId;
        const phoneMatch = customer.phone && customer.phone.toString().includes(trimmedInput);
        const lastNameMatch = customer.lastName && customer.lastName.toLowerCase().includes(trimmedInput);

        return phoneMatch || lastNameMatch;
      });

      this.isFound = this.result.length > 0;
      console.log(this.result);  

    }
  }

}
