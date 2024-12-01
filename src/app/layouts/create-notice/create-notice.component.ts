import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from 'app/Services/course.service';
import { GetPriceAfterTax } from '../../Services/calculations.service';
import { forkJoin } from 'rxjs';
import { NoticeService } from 'app/Services/notice.service';
import { PopupService } from 'app/Services/popup.service';
import { AuthService } from 'app/Services/auth.service';

@Component({
  selector: 'app-create-notice',
  templateUrl: './create-notice.component.html',
  styleUrls: ['./create-notice.component.scss']
})
export class CreateNoticeComponent implements OnInit {

  constructor(
    private popup: PopupService,
    private noticeService: NoticeService,
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private getPriceAfterTax: GetPriceAfterTax,
    private authService:AuthService) { }
    
  id : string 
  noticeInfo: any = {};
  servicesArray: any[] = [];
  
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => { //detect id change
       this.id = params['id'] || '';
      this.fetchNoticeData(this.id);
    });
  }
  
  fetchNoticeData(id: string): void {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    console.log(notifications);
    this.noticeInfo = notifications.find((notif: any) => notif?.id === id) || {};
    this.noticeInfo.serviceIds = this.noticeInfo.serviceIds || [];
    this.noticeInfo.quantity = this.noticeInfo.quantity || [];
  
    const serviceRequests = this.noticeInfo.serviceIds.map((serviceId: any) =>
      this.courseService.getCourseById(serviceId)
    );
  
    forkJoin(serviceRequests).subscribe((responses: any[]) => {
      let total = 0;
      this.servicesArray = []; // Clear the array to avoid duplications
  
      responses.forEach((res, i) => {
        if (res?.ok) {
          const serviceData = res.body?.data || {};
          serviceData.taxAmount = this.updateTaxAmount(serviceData.priceHT || 0);
          serviceData.priceAfterTax = (serviceData.taxAmount || 0) + (serviceData.priceHT || 0);
          serviceData.quantifiedPrice = 0;
  
          const quantity = this.noticeInfo.quantity[i] || 1;
          total += (serviceData.priceHT || 0) * quantity;
  
          this.servicesArray.push({ ...serviceData, quantity });
        }
      });
  
      this.noticeInfo.subTotal = total || 0;
      this.updateTotalWithTax();
      console.log('Services Array After Mapping:', this.servicesArray);
    });
  }
  

  updateTaxAmount(priceHT: number): number {
    const taxRate = this.noticeInfo.taxRate || 0;
    return (taxRate / 100) * priceHT;
  }

  updateTotalWithTax(): void {
    let totalTaxAmount = 0;
    let totalWithTax = 0;

    this.servicesArray.forEach(service => {
      const quantity = service.quantity || 1;
      const taxAmount = (service.taxAmount || 0) * quantity;
      const priceAfterTax = (service.priceAfterTax || 0) * quantity;

      totalTaxAmount += taxAmount;
      totalWithTax += priceAfterTax;
    });

    this.noticeInfo.totalTaxAmount = totalTaxAmount || 0;
    this.noticeInfo.totalWithTax = totalWithTax || 0;
  }

  applyChanges(): void {
    this.servicesArray.forEach((service) => {
      service.priceAfterTax = this.getPriceAfterTax.TaxCalculator(
        this.noticeInfo.taxRate || 0,
        [service]
      );
      service.taxAmount = this.updateTaxAmount(service.priceHT || 0);
      service.quantifiedPrice = (service.quantity || 1) * (service.priceAfterTax || 0);
    });
    this.updateTotalWithTax();
  }

  sendNoticeInfo(): void {
    if (isNaN(this.noticeInfo.totalWithTax)) {
      this.popup.showNotification("bottom", "right", "danger", "Invalid Total");
      return;
    }

    const notice: any = {
      customerId: this.noticeInfo.from?.id || '',
      services: this.servicesArray || [],
      subTotal: this.noticeInfo.subTotal || 0,
      totalTaxAmount: this.noticeInfo.totalTaxAmount || 0,
      totalWithTax: this.noticeInfo.totalWithTax || 0,
      taxRate: this.noticeInfo.taxRate || 0,
    };

    this.noticeService.addNotice(notice).subscribe((res) => {
      if (res.status === 201) {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const restNotifications = notifications.filter((notif: any) => notif.id !== this.id);
        this.authService.setNotifications = restNotifications
        this.popup.showNotification("bottom", 'right', 'success', 'Notice sent to the student');
      }
    });
  }
}
