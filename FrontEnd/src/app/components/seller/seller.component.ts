import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrl: './seller.component.scss'
})
export class SellerComponent {

  constructor(private router:Router) { }

  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
