import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//interfaces
import { EventDetails } from '../../interfaces/event/event';
import { CreateEvent } from '../../interfaces/event/createEvent';


@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.component.html',
  styleUrl: './update-event.component.scss'
})
export class UpdateEventComponent implements OnInit {

  isLoading: boolean = false;
  errorMessage: string | null = null;

  errorMessagePrice:string|undefined = undefined;
  errorMessageAvailableTickets:string|undefined = undefined;

  isFormVisible: boolean = false;
  updateEventForm: FormGroup;
  dataErrorMessage: string | undefined = undefined;
  timeErrorMessage: string | undefined = undefined;
  locationErrorMessage: string | undefined = undefined;
  today: string;
  minTime: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<UpdateEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { event: EventDetails }, // Dati passati tramite MAT_DIALOG_DATA 
    private fb: FormBuilder,
  ) {
    
    // Inizializza la data corrente
    const currentDate = new Date();
    this.today = currentDate.toISOString().split('T')[0];
    
    // Inizializza il form con valori passati tramite `data`
    this.updateEventForm = this.fb.group({
      titolo: [data.event.name, [Validators.required]],
      descrizione: [data.event.description, [Validators.required]],
      luogo: [data.event.location, [Validators.required]],
      data: [data.event.date, [Validators.required]],
      ora: [data.event.time, [Validators.required]],
      //ora: [data.event.time, [Validators.required, this.checkTime.bind(this)]],
      categoria: [data.event.category, [Validators.required]],
      prezzo: [data.event.price, [Validators.required, Validators.min(0)]],
      bigliettiDisponibili: [data.event.availableTickets, [Validators.required, Validators.min(1)]]
    });

  }

  ngOnInit(): void {
    this.dataErrorMessage = undefined;
    this.timeErrorMessage = undefined;
    this.locationErrorMessage = undefined;
    this.errorMessagePrice = undefined;
    this.errorMessageAvailableTickets = undefined;
  }

  // Funzione che chiude il dialogo
  onCancel(): void {
    this.dialogRef.close(false);
  }

  // Funzione per aggiornare l'evento
  updateEvent(): void {
    
    let eventUpdated: CreateEvent = {
      id: this.data.event.id,
      name: this.updateEventForm.get('titolo')!.value,
      description: this.updateEventForm.get('descrizione')!.value,
      location: this.updateEventForm.get('luogo')!.value,
      date: this.updateEventForm.get('data')!.value,
      time: this.updateEventForm.get('ora')!.value,
      price: this.updateEventForm.get('prezzo')!.value,
      category: this.updateEventForm.get('categoria')!.value,
      availableTickets: this.updateEventForm.get('bigliettiDisponibili')!.value,
      idSeller: this.data.event.idSeller
    };

    this.dialogRef.close(eventUpdated);
  }

  checkPrice():boolean{
    if(this.updateEventForm.get('prezzo')!.value < 0){
      this.errorMessagePrice = "Prezzo non valido";
      return true;
    }
    return false;
  }

  checkAvailableTickets():boolean{
    if(this.updateEventForm.get('bigliettiDisponibili')!.value < 0){
      this.errorMessageAvailableTickets = "Numero di biglietti non valido";
      return true;
    }
    return false;
  }

  checkTime(): boolean {
    const selectedDate = this.updateEventForm.get('data')?.value;
    const selectedTime = this.updateEventForm.get('ora')?.value;

    if (!selectedDate || !selectedTime) {
      return false; // Se data o ora non sono selezionati, non fare nulla
    }

    const currentDate = new Date();

    if (selectedDate === this.today) {
      const currentTime = currentDate.getHours() + ':' + (currentDate.getMinutes() < 10 ? '0' : '') + currentDate.getMinutes();
      const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
      const minAllowedTime = new Date(currentDate.getTime() + 60 * 60 * 1000);

      if (selectedDateTime < minAllowedTime) {
        this.timeErrorMessage = 'Seleziona almeno un\'ora da adesso';
        return true;
      }
    }
    this.timeErrorMessage = undefined;
    return false;
}
  

  
}
