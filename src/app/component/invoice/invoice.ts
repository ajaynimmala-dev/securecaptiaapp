import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { AsyncPipe, DatePipe, DecimalPipe, NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { BehaviorSubject, catchError, map, Observable, of, startWith, switchMap } from 'rxjs';
import { State } from '../../interface/state';
import { CustomHttpResponse } from '../../interface/appstate';
import { CustomerService } from '../../service/customer.service';
import { DataState } from '../../enum/datastate.enum';
import { EventType } from '../../enum/event.type.enum';
import { Customer } from '../../interface/customer';
import { Invoice } from '../../interface/invoice';
import { User } from '../../interface/user';
import {jsPDF as pdf } from 'jspdf';

@Component({
  selector: 'app-invoice',
  imports: [
    RouterLink,
    Navbar,
    NgForOf,
    AsyncPipe,
    NgIf,
    NgSwitchCase,
    NgSwitch,
    DatePipe,
    DecimalPipe,
  ],
  templateUrl: './invoice.html',
  styleUrl: './invoice.css',
})
export class InvoiceComponent implements OnInit {
  invoiceState$: Observable<State<CustomHttpResponse<Customer & Invoice & User>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Customer & Invoice & User>>(null);
  protected isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;
  readonly EventType = EventType;

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
  ) {}

  ngOnInit(): void {
    this.invoiceState$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.customerService.invoice$(Number(params.get('id'))).subscribe();
        return this.customerService.invoice$(Number(params.get('id'))).pipe(
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

  exportPdf(){
    const filename = `invoice -${this.dataSubject.value.data['invoice'].invoiceNumber}.pdf`;
    const doc = new pdf();
    doc.html(document.getElementById('invoice'),{margin:5,windowWidth:1000,width:200,
      callback:(invoice)=>invoice.save(filename)});
  }
}
