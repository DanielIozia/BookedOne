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
import { SellerService } from '../../services/seller.service';
import { EventResponse } from '../../interfaces/event/eventResponse';
import { EventDetails } from '../../interfaces/event/event';


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
    private router:Router,
    private seller:SellerService,
  ) {}

  user: User = {} as User;
  reservations: ReservationEvent[] = [];
  eventSeller:EventDetails[] = [];

  isLoading: boolean = false;
  isLoadingReservation: boolean = false;
  isLoadinEventSeller:boolean = false;
  
  reservedEvents: number = 0;
  upcomingReservations: number = 0;
  pastReservations: number = 0;

  myEvent:number = 0;
  expiredEventSeller:number = 0;


  success: boolean | undefined = undefined;
  viewNotification: boolean = false;

  ngOnInit(): void {
    this.loadUser();
    if(this.auth.getRole() == "customer"){
      this.loadReservation();
    }
    else{
      this.loadEventSeller();
    }


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

  loadEventSeller(){
    this.isLoadinEventSeller = true;
    this.seller.getSellerEvents(0, 10000)
    .subscribe((response: EventResponse) => {
      this.isLoadinEventSeller = false;
      this.myEvent = response.totalElements;
      this.eventSeller = response.content;
      this.calculateEventSeller();
    }, error => {
      console.error('Errore nel caricamento degli eventi', error);
      this.isLoadinEventSeller = false;
    })
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

  calculateEventSeller(): void {
    this.eventSeller.forEach(event => {
        const eventDate = new Date(event.date);
        const currentDate = new Date();

        const eventTime = new Date(event.time).getTime();  // Convertiamo il tempo dell'evento in millisecondi
        const currentTime = currentDate.getTime();         // Otteniamo l'ora attuale in millisecondi

        // Verifica se la data dell'evento è passata
        if (eventDate < currentDate) {  // setHours azzera l'orario per confrontare solo le date
          console.log(event)
          this.expiredEventSeller++;
        }
        // Verifica se l'evento è oggi
        else if (eventDate.setHours(0, 0, 0, 0) === currentDate.setHours(0, 0, 0, 0)) {
            // Verifica l'ora dell'evento
            if (eventTime < currentTime) {
              console.log(event)
                this.expiredEventSeller++;
            }
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

  goToEvents():void{
    this.router.navigate(['/seller/seller-events']);
  }
  

}
