import { DataState } from '../enum/datastate.enum';
import { User } from './user';
import { Event } from './event';
import { Role } from './role';
import { Customer } from './customer';

export interface LoginState {
  dataState: DataState;
  loginSuccess?: boolean;
  error?: string;
  message?: string;
  isUsingMfa?: boolean;
  phone?: string;
}

export interface CustomHttpResponse<T>{
  timestamp : Date;
  statusCode :number;
  status : number;
  message : string;
  reason?: string;
  developerMessage?:string;
  data?:T; //generic type i.e user,List of customers etc
}

export interface Profile{
  user?:User;
  events:Event[];
  roles : Role[];
  access_token:string;
  refresh_token:string;
}

export interface Page{
  content :Customer[];
  totalPages : number;
  totalElements : number;
  numberOfElements : number;
  size : number;
  number : number;
}

export interface CustomerState{
  user : User;
  customer : Customer;
}
