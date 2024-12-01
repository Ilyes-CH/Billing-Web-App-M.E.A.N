import { Component, OnInit } from '@angular/core';
import { InvoiceService } from 'app/Services/invoice.service';
import { NoticeService } from 'app/Services/notice.service';

@Component({
  selector: 'app-noticesandinvoices',
  templateUrl: './noticesandinvoices.component.html',
  styleUrls: ['./noticesandinvoices.component.scss']
})
export class NoticesandinvoicesComponent implements OnInit {

  constructor(private noticeService: NoticeService, private invoiceService: InvoiceService) { }
  public notices : Array<any> =[];
  public invoices : Array<any> =[];

  ngOnInit(): void {
    this.noticeService.getNotices().subscribe((res)=>{
      if(res.ok){
        this.notices = res.body['data']
      }
    })
    this.invoiceService.getInvoices().subscribe((res)=>{
      if(res.ok){
        this.invoices = res.body['data']
        console.log(this.invoices)
      }
    })
  }

}
