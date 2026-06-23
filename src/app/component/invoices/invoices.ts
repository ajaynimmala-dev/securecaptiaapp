import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { State } from '../../interface/state';
import { CustomHttpResponse, Page } from '../../interface/appstate';
import { User } from '../../interface/user';
import { UserService } from '../../service/user.service';
import { CustomerService } from '../../service/customer.service';
import { DataState } from '../../enum/datastate.enum';
import { EventType } from '../../enum/event.type.enum';
import { AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { Invoice } from '../../interface/invoice';

@Component({
  selector: 'app-invoices',
  imports: [
    RouterLink,
    Navbar,
    AsyncPipe,
    NgIf,
    NgSwitchCase,
    NgSwitch,
    NgForOf,
    DatePipe,
    NgClass,
  ],
  templateUrl: './invoices.html',
  styleUrl: './invoices.css',
})
export class Invoices implements OnInit {
  invoicesState$: Observable<State<CustomHttpResponse<Page<Invoice> & User>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Page<Invoice> & User>>(null);
  protected isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  private currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();
  protected showLogsSubject = new BehaviorSubject<boolean>(false);
  showLogs$ = this.showLogsSubject.asObservable();
  readonly DataState = DataState;
  readonly EventType = EventType;

  constructor(
    private router: Router,
    private userService: UserService,
    private customerService: CustomerService,
  ) {}

  ngOnInit(): void {
    this.customerService.invoices$().subscribe();
    this.invoicesState$ = this.customerService.invoices$().pipe(
      map((response) => {
        console.log(response);
        this.dataSubject.next(response);
        return { dataState: DataState.LOADED, appData: response };
      }),

      startWith({
        dataState: DataState.LOADING,
      }),

      catchError((error: string) => {
        return of({
          dataState: DataState.ERROR,
          error: error,
        });
      }),
    );
  }

  goToPage(pageNumber?: number, name?: string) {
    this.customerService.customer$().subscribe();
    this.invoicesState$ = this.customerService.invoices$(pageNumber).pipe(
      map((response) => {
        console.log(response);
        this.dataSubject.next(response);
        this.currentPageSubject.next(pageNumber);
        return { dataState: DataState.LOADED, appData: response };
      }),

      startWith({
        dataState: DataState.LOADED,
        appData: this.dataSubject.value,
      }),

      catchError((error: string) => {
        return of({
          dataState: DataState.ERROR,
          error: error,
          appData: this.dataSubject.value,
        });
      }),
    );
  }

  goToNextOrPreviousPage(direction: string) {
    this.goToPage(
      direction == 'forward'
        ? this.currentPageSubject.value + 1
        : this.currentPageSubject.value - 1,
    );
  }
}
