import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent {

  constructor(private router:Router){}
  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
