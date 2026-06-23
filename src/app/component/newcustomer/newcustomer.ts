import { Component, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { State } from '../../interface/state';
import { CustomHttpResponse, Page } from '../../interface/appstate';
import { User } from '../../interface/user';
import { UserService } from '../../service/user.service';
import { CustomerService } from '../../service/customer.service';
import { DataState } from '../../enum/datastate.enum';
import { EventType } from '../../enum/event.type.enum';
import { AsyncPipe, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Customer } from '../../interface/customer';

@Component({
  selector: 'app-newcustomer',
  imports: [Navbar, RouterLink, AsyncPipe, NgSwitchCase, NgSwitch, NgIf, FormsModule],
  templateUrl: './newcustomer.html',
  styleUrl: './newcustomer.css',
})
export class Newcustomer implements OnInit {
  newCustomerState$: Observable<State<CustomHttpResponse<Page<Customer> & User>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Page<Customer> & User>>(null);
  protected isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;
  readonly EventType = EventType;
  activities: null;

  constructor(
    private userService: UserService,
    private customerService: CustomerService,
  ) {}

  ngOnInit(): void {
    this.customerService.customer$().subscribe();
    this.newCustomerState$ = this.customerService.customer$().pipe(
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

  createCustomer(newCustomerForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.customerService.customer$().subscribe();
    this.newCustomerState$ = this.customerService.newCustomer$(newCustomerForm.value).pipe(
      map((response) => {
        console.log(response);
        newCustomerForm.reset({ type: 'INDIVIDUAL', appData: response });
        this.isLoadingSubject.next(false);
        return { dataState: DataState.LOADED, appData: this.dataSubject.value };
      }),

      startWith({
        dataState: DataState.LOADED,
        appData: this.dataSubject.value,
      }),

      catchError((error: string) => {
        this.isLoadingSubject.next(false);
        return of({
          dataState: DataState.LOADED,
          error: error,
        });
      }),
    );
  }
}

