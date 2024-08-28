import { Component, OnInit } from '@angular/core';
import { ReservationEvent } from '../../interfaces/reservation/reservationEvent';
import { CustomerService } from '../../services/customer.service';
import { ReservationEventResponse } from '../../interfaces/reservation/reservationEventResponse';
import { Reservation } from '../../interfaces/reservation/reservation';

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

  // Filtri per categoria, località, nome e data
  category: string | undefined;
  location: string | undefined;
  name: string | undefined;
  date: string | undefined;

  constructor(private customerService: CustomerService) {}


  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.isLoading = true;
    this.customerService.getReservations(this.currentPage, this.pageSize, this.category, this.location, this.name, this.date).subscribe(
      (data: ReservationEventResponse) => {
        console.log(data);
        this.reservations = data.content; 
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages; 
        this.isLoading = false;
      },
      (error) => {
        console.error('Errore nel caricamento delle prenotazioni', error);
        this.isLoading = false; 
      }
    );
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

  deleteReservation(reservation: Reservation): void {
    if (confirm('Sei sicuro di voler eliminare questa prenotazione?')) {
      this.isLoading = true;
      this.customerService.deleteReservation(reservation).subscribe(
        () => {
          this.isLoading = false;
          this.loadReservations();
          console.log('Prenotazione eliminata con successo');
        },
        (error) => {
          console.error('Errore nell\'eliminazione della prenotazione', error);
          this.isLoading = false;
        }
      );
    }
  }
}
