import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user/User';
import { AuthService } from '../../services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserComponent } from '../update-user/update-user.component';
import { CustomerService } from '../../services/customer.service';
import { ReservationEventResponse } from '../../interfaces/reservation/reservationEventResponse';
import { ReservationEvent } from '../../interfaces/reservation/reservationEvent';

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
  ) {}

  user: User = {} as User;
  reservations: ReservationEvent[] = [];
  expiredEvent:ReservationEvent[] = [];
  upComingEvent:ReservationEvent[] = [];
  

  isLoading: boolean = false;
  isLoadingReservation: boolean = false;
  
  reservedEvents: number = 0;
  upcomingReservations: number = 0;
  pastReservations: number = 0;

  showUpcomingEvents: boolean = false;
  showPastEvents: boolean = false;
  showAllEvents:boolean = false;

  

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
  
    // Resetta le liste prima di popolarle nuovamente
    this.expiredEvent = [];
    this.upComingEvent = [];
  
    // Divide le prenotazioni in base alla data dell'evento
    this.reservations.forEach(reservationEvent => {
      const eventDate = new Date(reservationEvent.event.date);
      
      if (eventDate > currentDate) {
        // Evento non ancora effettuato
        this.upComingEvent.push(reservationEvent);
      } else {
        // Evento scaduto
        this.expiredEvent.push(reservationEvent);
      }
    });
  
    // Calcola il numero di prenotazioni future e passate
    this.upcomingReservations = this.upComingEvent.length;
    this.pastReservations = this.expiredEvent.length;
  }
  



  ngOnInit(): void {
    this.loadUser();
    this.loadReservation();
  }

  update() {
    let dialogWidth = '70%';
    let dialogHeight = '60%';
  
    if (window.innerWidth <= 768) { // Schermi piccoli come tablet o cellulari
      dialogWidth = '95%';
      dialogHeight = '70%';
    } else if (window.innerWidth > 768 && window.innerWidth <= 1024) { // Schermi medi come tablet
      dialogWidth = '85%';
      dialogHeight = '65%';
    }
  
    const dialogRef = this.dialog.open(UpdateUserComponent, {
      width: dialogWidth,
      height: dialogHeight,
      data: { user: this.user }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        this.loadUser();  
      }
    });
  }

  showPastEvent(){
    this.showPastEvents = true;
    this.showUpcomingEvents = false;
    this.showAllEvents = false;
  }

  showUpComingEvent(){
    this.showUpcomingEvents = true;
    this.showPastEvents = false;
    this.showAllEvents = false;
  }

  showAllEvent(){
    this.showAllEvents = true;
    this.showUpcomingEvents = false;
    this.showPastEvents = false;
  }

  deleteProfile() {
    console.log("Profile deleted.");
  }

  getEventStatus(eventDate: Date): number {
    const currentDate = new Date();
    const eventDateTime = new Date(eventDate).getTime();
    const currentTime = currentDate.getTime();
  
    if (eventDateTime < currentTime) {
      return -1;
    } 
    else {
      const diffTime = eventDateTime - currentTime;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if(diffDays == 0){
        return 0;
      }
      return diffDays;
    }
  }

}
