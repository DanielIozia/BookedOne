import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user/User';
import { AuthService } from '../../services/auth/auth.service';
import { updateUser } from '../../interfaces/user/updateUser';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { Router } from '@angular/router';
import { EventDetails } from '../../interfaces/event/event';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SellerService } from '../../services/seller.service';
import { CreateEvent } from '../../interfaces/event/createEvent';

@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.component.html',
  styleUrl: './update-event.component.scss'
})
export class UpdateEventComponent implements OnInit {

  isLoading: boolean = false;
  errorMessage: string | null = null;

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
    private auth: AuthService,
  ) {
    console.log(data.event);
    
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
      categoria: [data.event.category, [Validators.required]],
      prezzo: [data.event.price, [Validators.required, Validators.min(0)]],
      bigliettiDisponibili: [data.event.availableTickets, [Validators.required, Validators.min(1)]]
    });

    // Aggiorna il `minTime` iniziale
    this.setMinTime();

    // Listener per cambiare l'ora minima in base alla data
    this.updateEventForm.get('data')?.valueChanges.subscribe(selectedDate => {
      if (selectedDate === this.today) {
        this.setMinTime(); // Imposta l'ora minima se la data è oggi
      } else {
        this.minTime = null; // Rimuovi il limite di ora minima se la data non è oggi
      }
    });
  }

  ngOnInit(): void {
    // Al caricamento, imposta l'ora minima
    this.setMinTime();
  }

  // Funzione che chiude il dialogo
  onCancel(): void {
    this.dialogRef.close(false);
  }

  // Funzione per aggiornare l'evento
  updateEvent(): void {
    console.log(this.auth.getId()!.toString());
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

  // Funzione che imposta l'ora minima come l'ora corrente
  setMinTime(): void {
    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    this.minTime = `${hours}:${minutes}`;
  }
}
