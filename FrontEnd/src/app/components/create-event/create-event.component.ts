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



}


