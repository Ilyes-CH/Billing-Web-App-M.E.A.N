import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticesandinvoicesComponent } from './noticesandinvoices.component';

describe('NoticesandinvoicesComponent', () => {
  let component: NoticesandinvoicesComponent;
  let fixture: ComponentFixture<NoticesandinvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoticesandinvoicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticesandinvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
