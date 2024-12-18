import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RequestCacheInterceptor implements HttpInterceptor {

  

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token : any = sessionStorage.getItem('accessToken') 
    if(token){
      request = request.clone({
        setHeaders:{
          Authorization : `Bearer ${token}`
        }
      })
    }
    return next.handle(request);
  }
}
