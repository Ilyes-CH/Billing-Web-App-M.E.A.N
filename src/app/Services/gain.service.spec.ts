import { TestBed } from '@angular/core/testing';

import { GainService } from './gain.service';

describe('GainService', () => {
  let service: GainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
