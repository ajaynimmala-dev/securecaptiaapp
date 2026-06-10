import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Key } from '../enum/key.enum';

@Injectable({ providedIn: 'root' })
export class TokenInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> | Observable<HttpResponse<unknown>> {
    if (
      req.url.includes('verify') ||
      req.url.includes('login') ||
      req.url.includes('register') ||
      req.url.includes('refresh') ||
      req.url.includes('resetpassword')
    ) {
      return next.handle(req);
    }
    return next.handle(this.addAuthorizationTokenHeader(req, localStorage.getItem(Key.TOKEN)));
  }

  private addAuthorizationTokenHeader(req:HttpRequest<unknown>,token:string):HttpRequest<any>{
    return req.clone({setHeaders: {Authorization :`Bearer ${token}`}})
  }
}

