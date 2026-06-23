import { Component } from '@angular/core';
import { Register } from '../../interface/appstate';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from '../../enum/datastate.enum';
import { UserService } from '../../service/user.service';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AsyncPipe, NgIf, NgSwitch } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [RouterLink, NgSwitch, NgIf, AsyncPipe, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  registerState$: Observable<Register> = of({ dataState: DataState.LOADED });
  readonly DataState = DataState;

  constructor(private userService: UserService) {}

  register(registerForm: NgForm) {
    this.registerState$ = this.userService.register$(registerForm.value).pipe(
      map((response) => {
        console.log(response);
        registerForm.reset();
        return { dataState: DataState.LOADED, registerSuccess: true,message : response.message };
      }),
      startWith({
        dataState: DataState.LOADING,
        registerSuccess: false,
      }),
      catchError((error: string) => {
        return of({
          dataState: DataState.ERROR,
          registerSuccess: false,
          error: error,
        });
      }),
    );
  }
}
