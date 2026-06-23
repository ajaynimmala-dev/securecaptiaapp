import { Component, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, startWith, switchMap } from 'rxjs';
import { State } from '../../interface/state';
import { CustomerState, CustomHttpResponse } from '../../interface/appstate';
import { CustomerService } from '../../service/customer.service';
import { DataState } from '../../enum/datastate.enum';
import { EventType } from '../../enum/event.type.enum';
import { AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-customer',
  imports: [
    Navbar,
    RouterLink,
    AsyncPipe,
    NgIf,
    NgSwitchCase,
    NgSwitch,
    NgClass,
    FormsModule,
    NgForOf,
    DatePipe,
  ],
  templateUrl: './customer.html',
  styleUrl: './customer.css',
})
export class Customer implements OnInit {
  customerState$: Observable<State<CustomHttpResponse<CustomerState>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<CustomerState>>(null);
  protected isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;
  readonly EventType = EventType;

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
  ) {}

  ngOnInit(): void {
    this.customerState$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.customerService.customers$(Number(params.get('customerId'))).subscribe();
        return this.customerService.customers$(Number(params.get('customerId'))).pipe(
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
      }),
    );
  }

  updateCustomer(customerForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.customerService
      .update$(customerForm.value)
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSubject.next({
            ...response,
            data: {
              ...response.data,
              customer: {
                ...response.data.customer,
                invoices: this.dataSubject.value.data.customer.invoices,
              },
            },
          });
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
            dataState: DataState.ERROR,
            error: error,
          });
        }),
      )
      .subscribe();
  }
}
