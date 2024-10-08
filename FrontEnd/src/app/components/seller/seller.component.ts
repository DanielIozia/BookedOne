import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth/auth.service';
import { DialogLogoutComponent } from '../dialog-logout/dialog-logout.component';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrl: './seller.component.scss'
})
export class SellerComponent {

  constructor(private router:Router, private userService:UserService, private dialog:MatDialog, private auth:AuthService){}
  

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
