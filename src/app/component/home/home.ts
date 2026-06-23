import { Component, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { StatsComponent } from '../stats/stats';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { State } from '../../interface/state';
import { CustomHttpResponse, Page } from '../../interface/appstate';
import { UserService } from '../../service/user.service';
import { DataState} from '../../enum/datastate.enum';
import { EventType } from '../../enum/event.type.enum';
import { CustomerService } from '../../service/customer.service';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { User } from '../../interface/user';
import { Customer } from '../../interface/customer';
import { Router, RouterLink } from '@angular/router';
import { Stats } from '../../interface/stats';

@Component({
  selector: 'app-home',
  imports: [Navbar, StatsComponent, AsyncPipe, NgIf, NgForOf, NgClass, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  homeState$: Observable<State<CustomHttpResponse<Page<Customer> & User & Stats>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Page<Customer> & User & Stats>>(null);
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
    this.homeState$ = this.customerService.customer$().pipe(
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

  goToPage(pageNumber?: number) {
    this.customerService.customer$().subscribe();
    this.homeState$ = this.customerService.customer$(pageNumber).pipe(
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

  selectCustomer(customer: Customer) {
    this.router.navigate([`/customers/${customer.id}`]);
  }
}
