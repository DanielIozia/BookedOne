import { Component, OnInit } from '@angular/core';
import { ReservationEvent } from '../../interfaces/reservation/reservationEvent';
import { CustomerService } from '../../services/customer.service';
import { ReservationEventResponse } from '../../interfaces/reservation/reservationEventResponse';

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
        this.reservations = data.content; // Assumiamo che i dati siano nella proprietà 'content' della risposta
        this.totalElements = data.totalElements; // Assumiamo che i dati contengano il numero totale di elementi
        this.totalPages = data.totalPages; // Assumiamo che la risposta contenga il numero totale di pagine
        this.isLoading = false;
      },
      (error) => {
        console.error('Errore nel caricamento delle prenotazioni', error);
        this.isLoading = false; // Assicurati di impostare isLoading su false anche in caso di errore
      }
    );
  }

  applyFilters(): void {
    this.currentPage = 0; // Resetta alla prima pagina quando si applicano filtri
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

}
