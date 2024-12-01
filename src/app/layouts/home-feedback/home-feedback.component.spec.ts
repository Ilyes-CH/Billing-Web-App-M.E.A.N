import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeFeedbackComponent } from './home-feedback.component';

describe('HomeFeedbackComponent', () => {
  let component: HomeFeedbackComponent;
  let fixture: ComponentFixture<HomeFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeFeedbackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
