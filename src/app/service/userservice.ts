import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, pipe, tap, throwError } from 'rxjs';
import { CustomHttpResponse, Profile } from '../interface/appstate';
import { Key } from '../enum/key.enum';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly server: string = 'http://localhost:8080';
  constructor(private http: HttpClient) {}

  login$ = (email: string, password: string) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .post<
          CustomHttpResponse<Profile>
        >(`${this.server}/user/login`, { email: email, password: password })
        .pipe(tap(console.log), catchError(this.handleError))
    );

  verifyCode$ = (email: string, code: string) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .get<CustomHttpResponse<Profile>>(`${this.server}/user/verify/code/${email}/${code}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );
  profile$ = () =>
    this.http
      .get<CustomHttpResponse<Profile>>(`${this.server}/user/profile`, {
        headers: new HttpHeaders().set(
          'Authorization',
          `Bearer ${localStorage.getItem(Key.TOKEN)}`,
        ),
      })
      .pipe(tap(console.log),
        catchError(this.handleError));

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      errorMessage = `A client error occurred-${error.error.message}`;
    } else {
      if (error.error.reason) {
        errorMessage = error.error.reason;
      } else {
        errorMessage = ` An error occurred -${error.status}`;
      }
    }
    return throwError(() => errorMessage);
  }
}
