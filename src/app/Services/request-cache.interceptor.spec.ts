import { TestBed } from '@angular/core/testing';

import { RequestCacheInterceptor } from './request-cache.interceptor';

describe('RequestCacheInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      RequestCacheInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: RequestCacheInterceptor = TestBed.inject(RequestCacheInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
