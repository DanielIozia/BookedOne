import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DialogLogoutComponent } from '../dialog-logout/dialog-logout.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent {

  constructor(private router:Router, private dialog:MatDialog, private auth:AuthService){}
  

  logout(): void {
    const dialogRef = this.dialog.open(DialogLogoutComponent, {
      width: '300px',
      disableClose: true // L'utente deve decidere
    });

    dialogRef.afterClosed().subscribe((result:boolean) => {
      if(result){
        this.auth.logout();
        this.router.navigate(['/login']);
      }
    });
  }

}
