import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../services/auth/auth.service';
import { EventDetails } from '../../interfaces/event/event';
import { ReservationEvent } from '../../interfaces/reservation/reservationEvent';

@Component({
  selector: 'app-dialog-delete-reserve-event',
  templateUrl: './dialog-delete-reserve-event.component.html',
  styleUrls: ['./dialog-delete-reserve-event.component.scss']
})
export class DialogDeleteReserveEventComponent {
  role: string;
  isReservation: boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogDeleteReserveEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { reservation?: ReservationEvent, event?: EventDetails }, // Opzionali, dipende dal contesto
    private auth: AuthService
  ) { 
    this.role = this.auth.getRole()!;
    this.isReservation = !!this.data.reservation; // Se abbiamo una prenotazione, è una cancellazione di prenotazione
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
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
}
