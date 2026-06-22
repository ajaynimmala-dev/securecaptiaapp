import { Component, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { State } from '../../interface/state';
import { CustomHttpResponse, Page } from '../../interface/appstate';
import { User } from '../../interface/user';
import { UserService } from '../../service/user.service';
import { CustomerService } from '../../service/customer.service';
import { Customer } from '../../interface/customer';
import { DataState } from '../../enum/datastate.enum';
import { EventType } from '../../enum/event.type.enum';
import { AsyncPipe, NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-customers',
  imports: [
    Navbar,
    RouterLink,
    AsyncPipe,
    NgSwitch,
    NgSwitchCase,
    NgIf,
    NgForOf,
    NgClass,
    FormsModule,
  ],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers implements OnInit {
  customersState$: Observable<State<CustomHttpResponse<Page & User>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Page & User>>(null);
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
    this.customerService.customer$().subscribe();
    this.customersState$ = this.customerService.searchCustomers$().pipe(
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

  searchCustomers(searchForm: NgForm): void {
    this.currentPageSubject.next(0);
    this.customerService.customer$().subscribe();
    this.customersState$ = this.customerService.searchCustomers$(searchForm.value.name).pipe(
      map((response) => {
        console.log(response);
        this.dataSubject.next(response);
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
        });
      }),
    );
  }

  goToPage(pageNumber?: number, name?: string) {
    this.customerService.customer$().subscribe();
    this.customersState$ = this.customerService.searchCustomers$(name, pageNumber).pipe(
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

  goToNextOrPreviousPage(direction: string, name?: string) {
    this.goToPage(
      direction == 'forward'
        ? this.currentPageSubject.value + 1
        : this.currentPageSubject.value - 1,
      name,
    );
  }

  selectCustomer(customer: Customer) {
    this.router.navigate([`/customers/${customer.id}`]);
  }
}
