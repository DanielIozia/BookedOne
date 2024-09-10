import { Component, OnInit } from '@angular/core';
import { ReservationEvent } from '../../interfaces/reservation/reservationEvent';
import { CustomerService } from '../../services/customer.service';
import { ReservationEventResponse } from '../../interfaces/reservation/reservationEventResponse';
import { Reservation } from '../../interfaces/reservation/reservation';
import { DialogDeleteReserveEventComponent } from '../dialog-delete-reserve-event/dialog-delete-reserve-event.component';
import { MatDialog } from '@angular/material/dialog';
import { EventDetails } from '../../interfaces/event/event';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss'] // Corretto qui: da styleUrl a styleUrls
})
export class ReservationComponent implements OnInit {

  reservations: ReservationEvent[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  isLoading: boolean = false;
  isDeleting:boolean = false;

  // Filtri per categoria, località, nome e data
  category: string | undefined;
  location: string | undefined;
  name: string | undefined;
  date: string | undefined;
  expired:boolean = false;

  canClean:boolean = false;
  success: boolean | undefined = undefined;
  viewNotification: boolean = false;
  

  constructor(private customerService: CustomerService, private dialog:MatDialog) {}


  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.isLoading = true;
    this.customerService.getReservations(this.currentPage, this.pageSize, this.category, this.location, this.name, this.date, this.expired).subscribe(
      (data: ReservationEventResponse) => {
        this.canClean = (this.category || this.location || this.name || this.date || this.expired) ? true : false;
        if(data.content.length == 0 && this.currentPage > 0){
          //Non ci sono altre prenotazioni nella pagina attuale, quindi torno indietro
          this.currentPage--;
          this.loadReservations();
        }
        else{
          this.reservations = data.content; 
          this.totalElements = data.totalElements;
          this.totalPages = data.totalPages; 
          this.isLoading = false;
        }
      },
      (error) => {
        console.error('Errore nel caricamento delle prenotazioni', error);
        this.isLoading = false; 
      }
    );
  }

  isEventExpired(event: EventDetails): boolean {
    if (!event.date || !event.time) {
      return false; // Se data o ora non sono presenti, non può essere scaduto
    }
  
    try {
      // Parso la data in formato 'yyyy-MM-dd'
      const eventDateParts = event.date.toString().split('-'); // Assumendo che event.date sia 'yyyy-MM-dd'
      const eventTimeParts = event.time.toString().split(':'); // Assumendo che event.time sia 'HH:mm'
  
      // Creazione di un nuovo oggetto Date combinando data e ora
      const eventDateTime = new Date(
        Number(eventDateParts[0]), // Anno
        Number(eventDateParts[1]) - 1, // Mese (in JavaScript i mesi vanno da 0 a 11)
        Number(eventDateParts[2]), // Giorno
        Number(eventTimeParts[0]), // Ora
        Number(eventTimeParts[1])  // Minuti
      );
  
      const now = new Date();
      // Restituisci true se l'evento è passato
      return eventDateTime.getTime() < now.getTime();
    } catch (error) {
      console.error("Errore nel parsing della data o dell'ora dell'evento", error);
      return false; // Se c'è un errore nel parsing, lo trattiamo come non scaduto
    }
  }
  
  

  
  

  applyFilters(): void {
    this.currentPage = 0;
    this.loadReservations();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadReservations();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadReservations();
    }
  }

 

  deleteReservation(reservation: ReservationEvent): void {

    const dialogRef = this.dialog.open(DialogDeleteReserveEventComponent, {
      width: '300px',
      data: { reservation }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) { // If user confirmed deletion
        this.success = true;
        this.isDeleting = true;
        this.viewNotification = true;
        this.customerService.deleteReservation(reservation.reservation).subscribe(
          () => {
            this.isDeleting = false;
            this.loadReservations();
            console.log('Prenotazione eliminata con successo');
            this.autoCloseNotification();
          },
          (error) => {
            this.success = false;
            this.viewNotification = true;
            console.error('Errore nell\'eliminazione della prenotazione', error);
            this.isDeleting = false;
            this.autoCloseNotification();
          }
        );
      }
    });
  }

  cleanFilters(){
    if(this.canClean){
      this.category = undefined;
      this.location = undefined;
      this.name = undefined;
      this.date = undefined;
      this.canClean = false;
      this.expired = false;
      this.applyFilters();
    }
  }

  autoCloseNotification() {
    setTimeout(() => {
      this.viewNotification = false;
    }, 5000); // Nascondi dopo 5 secondi
  }

}
