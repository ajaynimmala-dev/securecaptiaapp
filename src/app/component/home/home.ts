import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Stats } from '../stats/stats';

@Component({
  selector: 'app-home',
  imports: [Navbar, Stats],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
