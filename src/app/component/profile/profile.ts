import { Component, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, DatePipe, NgClass, NgIf } from '@angular/common';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { CustomHttpResponse, Profile } from '../../interface/appstate';
import { UserService } from '../../service/userservice';
import { State } from '../../interface/state';
import { DataState } from '../../enum/datastate.enum';

@Component({
  selector: 'app-profile',
  imports: [Navbar, RouterLink, FormsModule, NgClass, DatePipe, NgIf, AsyncPipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  profileState: Observable<State<CustomHttpResponse<Profile>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Profile>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  user: any;
  readonly DataState = DataState;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.profileState = this.userService.profile$().pipe(
      map((response) => {
        console.log(response);
        // this.dataSubject.next(response);
        this.user = {
          ...response?.data?.user,
        };
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
}
