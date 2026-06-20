import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../service/userservice';
import { User } from '../../interface/user';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  @Input() user:User;
  constructor(private router :Router,private userService:UserService){

  }

  logOut():void{
    this.userService.logOut();
    this.router.navigate(['/login']);
  }
}
