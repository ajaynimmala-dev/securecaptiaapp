import { Component, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { State } from '../../interface/state';
import { CustomHttpResponse } from '../../interface/appstate';
import { User } from '../../interface/user';
import { UserService } from '../../service/user.service';
import { CustomerService } from '../../service/customer.service';
import { DataState } from '../../enum/datastate.enum';
import { Customer } from '../../interface/customer';
import { AsyncPipe, NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-newinvoice',
  imports: [Navbar, RouterLink, AsyncPipe, NgIf, NgSwitchCase, NgSwitch, FormsModule, NgForOf],
  templateUrl: './newinvoice.html',
  styleUrl: './newinvoice.css',
})
export class Newinvoice implements OnInit {
  newInvoiceState$: Observable<State<CustomHttpResponse<Customer[] & User>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Customer[] & User>>(null);
  protected isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;

  constructor(
    private userService: UserService,
    private customerService: CustomerService,
  ) {}

  ngOnInit(): void {
    this.customerService.newInvoice$().subscribe();
    this.newInvoiceState$ = this.customerService.newInvoice$().pipe(
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

  newInvoice(newInvoiceForm: NgForm): void {
    console.log(newInvoiceForm.value);
    this.isLoadingSubject.next(true);
    this.customerService.customer$().subscribe();
    this.newInvoiceState$ = this.customerService.createInvoice$(newInvoiceForm.value.customerId,newInvoiceForm.value).pipe(
      map((response) => {
        console.log(response);
        newInvoiceForm.reset({ status: 'PENDING' });
        this.isLoadingSubject.next(false);
        this.dataSubject.next(response);
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

