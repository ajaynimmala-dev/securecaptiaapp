import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { HttpCacheService } from '../service/http.cache.service';

@Injectable({ providedIn: 'root' })
export class CacheInterceptor implements HttpInterceptor {
  constructor(private httpCacheService: HttpCacheService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> | Observable<HttpResponse<any>> {
    if (
      req.url.includes('login') ||
      req.url.includes('verify') ||
      req.url.includes('register') ||
      req.url.includes('refresh') ||
      req.url.includes('resetpassword')
    ) {
      return next.handle(req);
    }
    if (req.method !== 'GET' || req.url.includes('download')) {
      this.httpCacheService.evictAll();
      return next.handle(req);
    }
    const cachedResponse: HttpResponse<any> = this.httpCacheService.get(req.url);
    if (cachedResponse) {
      console.log("Ca");
      this.httpCacheService.logCache();
      return of(cachedResponse);
    }
    console.log("call");
    return this.handleRequestCache(req, next);
  }

  private handleRequestCache(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> | Observable<HttpResponse<any>> {
    return next.handle(req).pipe(
      tap((response) => {
        if (response instanceof HttpResponse && req.method !== 'DELETE') {
          this.httpCacheService.put(req.url, response);
        }
      }),
    );
  }
}
