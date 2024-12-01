import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetPricingComponent } from './get-pricing.component';

describe('GetPricingComponent', () => {
  let component: GetPricingComponent;
  let fixture: ComponentFixture<GetPricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetPricingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
