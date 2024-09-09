import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventDetails } from '../../interfaces/event/event';

@Component({
  selector: 'app-dialog-reserve-event',
  templateUrl: './dialog-reserve-event.component.html',
  styleUrls: ['./dialog-reserve-event.component.scss']
})
export class DialogReserveEventComponent {
  tickets: number = 1; // Numero iniziale di biglietti
  errorMessage:string | null = null;

  constructor(
    public dialogRef: MatDialogRef<DialogReserveEventComponent>,
    @Inject(MAT_DIALOG_DATA) public event: EventDetails // Ottieni i dettagli dell'evento passati
  ) {}



  onCancel(): void {
    this.dialogRef.close();
  }

  onPurchase(): void {
   
    if (this.tickets <= 0 || isNaN(this.tickets)) {
      this.errorMessage = "Numero di biglietti non valido";
      return;
    }

    if(this.tickets > this.event.availableTickets){
      this.errorMessage = "Numero di biglietti non disponibili";
      return;
    }

    this.errorMessage = null; // Pulisce il messaggio di errore
    this.dialogRef.close({ event: this.event, numberOfTickets: this.tickets });
  }
}
