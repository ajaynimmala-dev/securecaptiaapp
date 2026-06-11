import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { CustomHttpResponse, Profile } from '../interface/appstate';
import { BehaviorSubject, catchError, Observable, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../service/userservice';
import { Key } from '../enum/key.enum';

@Injectable({providedIn: 'root'})
export class TokenInterceptor implements HttpInterceptor {
  private isTokenRefreshing = false;
  private refreshTokenSubject =
    new BehaviorSubject<
      CustomHttpResponse<Profile> | null
    >(null);

  constructor(
    private router: Router,
    private userService: UserService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (
      req.url.includes('login') ||
      req.url.includes('verify') ||
      req.url.includes('register') ||
      req.url.includes('refresh')
    ) {
      return next.handle(req);
    }

    const token = localStorage.getItem(Key.TOKEN);
    const authReq = token ? this.addAuthorizationTokenHeader(req,token) : req;

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (error.status === 401) {
          return this.handleRefreshToken(req,next);
        }
        return throwError(() => error);
      })
    );
  }

  private handleRefreshToken(req: HttpRequest<any>, next: HttpHandler) {

    if (!this.isTokenRefreshing) {
      this.isTokenRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.userService.refreshToken$().pipe(
          switchMap(
            response => {
              this.isTokenRefreshing = false;
              this.refreshTokenSubject.next(response);
              return next.handle(this.addAuthorizationTokenHeader(req,response.data.access_token));
            })
        );
    }

    return this.refreshTokenSubject.pipe(
      switchMap(response => {return next.handle(this.addAuthorizationTokenHeader(req,response.data.access_token));
        })
    );
  }

  private addAuthorizationTokenHeader(req: HttpRequest<any>, token: string) {
    return req.clone({ setHeaders: { Authorization:`Bearer ${token}`
      }
    });
  }
}
