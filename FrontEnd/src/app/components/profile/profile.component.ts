import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user/User';
import { AuthService } from '../../services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserComponent } from '../update-user/update-user.component';
import { CustomerService } from '../../services/customer.service';
import { ReservationEventResponse } from '../../interfaces/reservation/reservationEventResponse';
import { ReservationEvent } from '../../interfaces/reservation/reservationEvent';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private dialog: MatDialog,
    private customerService: CustomerService,
    private router:Router
  ) {}

  user: User = {} as User;
  reservations: ReservationEvent[] = [];

  isLoading: boolean = false;
  isLoadingReservation: boolean = false;
  
  reservedEvents: number = 0;
  upcomingReservations: number = 0;
  pastReservations: number = 0;

  success: boolean | undefined = undefined;
  viewNotification: boolean = false;

  ngOnInit(): void {
    this.loadUser();
    this.loadReservation();
  }

  loadUser() {
    this.isLoading = true;
    if(this.auth.getToken()){
      this.userService.profile(this.auth.getToken()!).subscribe(
        (user: User) => {
          this.isLoading = false;
          this.user = user;
        },
        (error) => {
          console.log('Errore nel caricamento del profilo', error);
          this.isLoading = false;
        }
      );
    }
  }

  loadReservation() {
    this.isLoadingReservation = true;
  
    this.customerService.getReservations(0, 10000).subscribe(
      (data: ReservationEventResponse) => {
        this.isLoadingReservation = false;
        this.reservedEvents = data.totalElements;
        this.reservations = data.content;
        this.calculateReservations();
      },
      (error) => {
        console.error('Errore nel caricamento delle prenotazioni', error);
        this.isLoadingReservation = false;
      }
    );
  }

  calculateReservations(): void {
    const currentDate = new Date();
    this.reservations.forEach(reservationEvent => {
      const eventDate = new Date(reservationEvent.event.date);
      
      if (eventDate >= currentDate) {
        // Evento non ancora effettuato
        this.upcomingReservations++;
      } 
      else {
        // Evento scaduto
        this.pastReservations++;
      }
    });    
  }
  

  update() {
    let dialogWidth = '50%';
    if (window.innerWidth <= 768) { // Schermi piccoli come tablet o cellulari
      dialogWidth = '95%';
    } 
    
    const dialogRef = this.dialog.open(UpdateUserComponent, {
      width: dialogWidth,
      data: { user: this.user }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        this.success = true;
        this.viewNotification = true;
        this.loadUser();  
        this.autoCloseNotification();
      }
    }, error => {
      this.loadUser();  
      this.success = false;
      this.viewNotification = true;
      this.autoCloseNotification();
    });
  }

  autoCloseNotification() {
    setTimeout(() => {
      this.viewNotification = false;
    }, 5000); // Nascondi dopo 5 secondi
  }

  goToReservations(): void {
    this.router.navigate(['/customer/reservations']);
  }
  

}
