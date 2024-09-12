import { Component } from '@angular/core';
import { SellerService } from '../../services/seller.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { CreateEvent } from '../../interfaces/event/createEvent';


@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss'
})
export class CreateEventComponent {

  createEventForm:FormGroup;
  isLoading: boolean = false;
  viewNotification: boolean = false;
  success: boolean | undefined = undefined;
  errorMessage:string | undefined = undefined;
  dataErrorMessage:string | undefined = undefined;
  timeErrorMessage:string | undefined = undefined;
  locationErrorMessage:string | undefined = undefined;
  today:string;
  errorMessageAvailableTickets:string|undefined = undefined;
  errorMessagePrice:string|undefined = undefined;

  constructor(private seller:SellerService, private fb: FormBuilder, private auth:AuthService){
    

    this.createEventForm = this.fb.group({
      titolo: ['', [Validators.required]],
      descrizione: ['', [Validators.required]],
      luogo: ['', [Validators.required]],
      data: ['', [Validators.required]],
      ora: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      prezzo: ['', [Validators.required]],
      bigliettiDisponibili: ['', [Validators.required]]
    });

    const currentDate = new Date();
    this.today = currentDate.toISOString().split('T')[0];
  }



  createEvent(){
    this.isLoading = true;
    this.dataErrorMessage = undefined;
    this.timeErrorMessage = undefined;
    this.locationErrorMessage = undefined;

    let newEvent:CreateEvent = {
      name: this.createEventForm.get('titolo')!.value,
      description: this.createEventForm.get('descrizione')!.value,
      location: this.createEventForm.get('luogo')!.value,
      date: this.createEventForm.get('data')!.value,
      time: this.createEventForm.get('ora')!.value,
      price: this.createEventForm.get('prezzo')!.value,
      category: this.createEventForm.get('categoria')!.value,
      availableTickets: this.createEventForm.get('bigliettiDisponibili')!.value,
      idSeller: this.auth.getId()!.toString()
    }



    this.seller.createEvent(newEvent).subscribe (data => {
      this.isLoading = false;
      this.viewNotification = true;
      this.success = true;
      this.createEventForm.reset();
      this.autoCloseNotification();
    }, 
    error => {
      if(error.error.title == "Errore Data"){
        this.dataErrorMessage = "Data non valida";
        this.createEventForm.get('data')?.setValue('');
        this.createEventForm.get('ora')?.setValue('');
      }
      else if(error.error.title == "Evento Esistente"){

        this.dataErrorMessage = "Data non valida";
        this.timeErrorMessage = "Ora non valida";
        this.locationErrorMessage = "Luogo non valido";

        this.createEventForm.get('data')?.setValue('');
        this.createEventForm.get('ora')?.setValue('');
        this.createEventForm.get('luogo')?.setValue('');
      }

      else{
        this.createEventForm.reset();
      }

      this.isLoading = false;
      this.viewNotification = true;
      this.success = false;
      this.errorMessage = error.error.message;
      this.autoCloseNotification();
    })
  }

  onCancel(){
    this.createEventForm.reset();
    this.dataErrorMessage = undefined;
    this.timeErrorMessage = undefined;
    this.locationErrorMessage = undefined; 
  }

  autoCloseNotification() {
    setTimeout(() => {
      this.viewNotification = false;
    }, 7000); // Nascondi dopo 7 secondi
  }

  checkTime(): boolean {
    const selectedDate = this.createEventForm.get('data')?.value;
    const selectedTime = this.createEventForm.get('ora')?.value;

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

checkPrice():boolean{
  if(this.createEventForm.get('prezzo')!.value < 0){
    this.errorMessagePrice = "Prezzo non valido";
    return true;
  }
  return false;
}



checkAvailableTickets():boolean{
  if(this.createEventForm.get('bigliettiDisponibili')!.value <= 0){
    if(this.createEventForm.get('bigliettiDisponibili')!.touched){
    this.errorMessageAvailableTickets = "Numero di biglietti non valido";
    return true;
    }
  }
  return false;
}



}


