import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReservationEvent } from '../../interfaces/reservation/reservationEvent';

@Component({
  selector: 'app-dialog-delete-reserve-event',
  templateUrl: './dialog-delete-reserve-event.component.html',
  styleUrls: ['./dialog-delete-reserve-event.component.scss']
})
export class DialogDeleteReserveEventComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogDeleteReserveEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { reservation: ReservationEvent }
  ) { }

  onConfirm(): void {
    
    // Confirm the deletion
    this.dialogRef.close(true);
  }

  onCancel(): void {
    // Cancel the deletion
    this.dialogRef.close(false);
  }
}
