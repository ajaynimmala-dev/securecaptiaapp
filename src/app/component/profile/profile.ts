import { Component, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AsyncPipe, DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { CustomHttpResponse, Profile } from '../../interface/appstate';
import { UserService } from '../../service/userservice';
import { State } from '../../interface/state';
import { DataState } from '../../enum/datastate.enum';
import { EventType} from '../../enum/event.type.enum';

@Component({
  selector: 'app-profile',
  imports: [Navbar, RouterLink, FormsModule, DatePipe, NgIf, AsyncPipe, NgForOf, NgClass],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  profileState: Observable<State<CustomHttpResponse<Profile>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Profile>>(null);
  protected isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  protected showLogsSubject = new BehaviorSubject<boolean>(false);
  showLogs$ = this.showLogsSubject.asObservable();
  readonly DataState = DataState;
  readonly EventType = EventType;
  activities: null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.profile$().subscribe();
    this.profileState = this.userService.profile$().pipe(
      map((response) => {
        this.dataSubject.next(response);
        return { dataState: DataState.LOADED, appData: response };
      }),

      startWith({
        dataState: DataState.LOADING,
      }),

      catchError((error: string) => {
        return of({
          dataState: DataState.ERROR,
          appData: this.dataSubject.value,
          error: error,
        });
      }),
    );
  }

  updateProfile(profileForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.profileState = this.userService.update$(profileForm.value).pipe(
      map((response) => {
        console.log(response.data);
        this.dataSubject.next({
          ...response,
          data: response.data,
        });
        this.isLoadingSubject.next(false);
        return { dataState: DataState.LOADED, appData: response };
      }),

      startWith({
        dataState: DataState.LOADED,
        appData: this.dataSubject.value,
      }),

      catchError((error: string) => {
        this.isLoadingSubject.next(false);
        return of({
          dataState: DataState.ERROR,
          appData: this.dataSubject.value,
          error: error,
        });
      }),
    );
  }

  updatePassword(passwordForm: NgForm): void {
    this.isLoadingSubject.next(true);
    if (passwordForm.value.newPassword === passwordForm.value.confirmNewPassword) {
      this.profileState = this.userService.updatePassword$(passwordForm.value).pipe(
        map((response) => {
          console.log(response.data);
          this.dataSubject.next({
            ...response,
            data: response.data,
          });
          this.isLoadingSubject.next(false);
          return { dataState: DataState.LOADED, appData: response };
        }),

        startWith({
          dataState: DataState.LOADED,
          appData: this.dataSubject.value,
        }),

        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({
            dataState: DataState.ERROR,
            appData: this.dataSubject.value,
            error: error,
          });
        }),
      );
    } else {
      passwordForm.reset();
      this.isLoadingSubject.next(false);
    }
  }

  updateRole(roleForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.profileState = this.userService.updateRole$(roleForm.value.roleName).pipe(
      map((response) => {
        console.log(response.data);
        this.dataSubject.next({
          ...response,
          data: response.data,
        });
        this.isLoadingSubject.next(false);
        return { dataState: DataState.LOADED, appData: response };
      }),

      startWith({
        dataState: DataState.LOADED,
        appData: this.dataSubject.value,
      }),

      catchError((error: string) => {
        this.isLoadingSubject.next(false);
        return of({
          dataState: DataState.ERROR,
          appData: this.dataSubject.value,
          error: error,
        });
      }),
    );
  }

  updateAccountSettings(settings: NgForm): void {
    this.isLoadingSubject.next(true);
    this.profileState = this.userService.updateAccountSettings$(settings.value).pipe(
      map((response) => {
        console.log(response.data);
        this.dataSubject.next({
          ...response,
          data: response.data,
        });
        this.isLoadingSubject.next(false);
        return { dataState: DataState.LOADED, appData: response };
      }),

      startWith({
        dataState: DataState.LOADED,
        appData: this.dataSubject.value,
      }),

      catchError((error: string) => {
        this.isLoadingSubject.next(false);
        return of({
          dataState: DataState.ERROR,
          appData: this.dataSubject.value,
          error: error,
        });
      }),
    );
  }

  toggleMfa(): void {
    this.isLoadingSubject.next(true);
    this.profileState = this.userService.toggleMfa$().pipe(
      map((response) => {
        console.log(response.data);
        this.dataSubject.next({
          ...response,
          data: response.data,
        });
        this.isLoadingSubject.next(false);
        return { dataState: DataState.LOADED, appData: response };
      }),

      startWith({
        dataState: DataState.LOADED,
        appData: this.dataSubject.value,
      }),

      catchError((error: string) => {
        this.isLoadingSubject.next(false);
        return of({
          dataState: DataState.ERROR,
          appData: this.dataSubject.value,
          error: error,
        });
      }),
    );
  }

  updatePicture(image: File): void {
    if (image) {
      this.isLoadingSubject.next(true);
      this.profileState = this.userService.updateImage$(this.getFormDate(image)).pipe(
        map((response) => {
          console.log(response.data);
          this.dataSubject.next({
            ...response,
            data: {
              ...response.data,
              user: {
                ...response.data.user,
                imageUrl: `${response.data.user.imageUrl}?time=${new Date().getTime()}`,
              },
            },
          });
          this.isLoadingSubject.next(false);
          return { dataState: DataState.LOADED, appData: response };
        }),

        startWith({
          dataState: DataState.LOADED,
          appData: this.dataSubject.value,
        }),

        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({
            dataState: DataState.ERROR,
            appData: this.dataSubject.value,
            error: error,
          });
        }),
      );
    }
  }

  toggleLogs():void{
    this.showLogsSubject.next(!this.showLogsSubject.value);
  }

  private getFormDate(image: File) {
    const formData = new FormData();
    formData.append('image', image);
    return formData;
  }
}
