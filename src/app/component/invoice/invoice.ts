import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {Navbar} from '../navbar/navbar';

@Component({
  selector: 'app-invoice',
  imports: [RouterLink, Navbar],
  templateUrl: './invoice.html',
  styleUrl: './invoice.css',
})
export class Invoice {}
