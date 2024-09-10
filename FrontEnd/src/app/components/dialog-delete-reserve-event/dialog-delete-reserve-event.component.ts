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
}
