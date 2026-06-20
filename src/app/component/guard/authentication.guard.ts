import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import {UserService} from '../../service/userservice';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard{
  constructor(private userService: UserService,private router: Router) { }

  canActivate(routSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.isAuthenticated();
  }

  private isAuthenticated() {
    if (this.userService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
