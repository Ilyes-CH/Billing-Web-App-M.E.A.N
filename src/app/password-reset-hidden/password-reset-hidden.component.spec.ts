import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetHiddenComponent } from './password-reset-hidden.component';

describe('PasswordResetHiddenComponent', () => {
  let component: PasswordResetHiddenComponent;
  let fixture: ComponentFixture<PasswordResetHiddenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordResetHiddenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordResetHiddenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
