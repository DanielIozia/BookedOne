import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';
import { EventResponse } from '../../interfaces/event/eventResponse';
import { EventDetails } from '../../interfaces/event/event';
import { MatDialog } from '@angular/material/dialog';
import { DialogReserveEventComponent } from '../dialog-reserve-event/dialog-reserve-event.component';
import { CustomerService } from '../../services/customer.service';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})


export class EventsComponent {

  events: EventDetails[] = [];
  page: number = 0;
  size: number = 10;
  totalPages: number = 0;
  buyEventLoading:boolean = false;
  success:boolean|undefined = undefined;
  viewNotification:boolean = false;
  
  filters = {
    name: '',
    category: '',
    location: '',
    date: null
  }
  isLoading:boolean = false;

  canClean:boolean = false;
  

  constructor(private eventService: EventService, public dialog: MatDialog, private customerService:CustomerService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.eventService.getAllEvents(this.page, this.size, this.filters.category, this.filters.location, this.filters.name, this.filters.date)
      .subscribe((response: EventResponse) => {
        this.canClean = (this.filters.category || this.filters.location || this.filters.name || this.filters.date) ? true : false;
        console.log(response.content);
        this.isLoading = false;
        this.events = response.content;
        console.log("lunghezza: ", this.events.length);
        this.totalPages = response.totalPages;
      });
  }

  applyFilters(): void {
    this.page = 0; // Resetta alla prima pagina quando si applicano filtri
    this.loadEvents();
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadEvents();
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadEvents();
    }
  }

  openDialogReserveEvent(event: EventDetails): void {

    const dialogRef = this.dialog.open(DialogReserveEventComponent, {
      width: '400px',
      data: event
    });
  
    dialogRef.afterClosed().subscribe(result => {
      //se chiudo senza prenotare, result è undefined(inutile fare chiamate al back)
      if(result != undefined){
        this.buyEventLoading = true;
        this.customerService.reserveEvent(result).subscribe (data => {
          this.success = true;
          this.viewNotification = true;
          this.buyEventLoading = false; 
          this.loadEvents();
          this.autoCloseNotification(); // Chiude automaticamente la notifica
        }, error => {
          this.success = false;
          this.viewNotification = true;
          this.buyEventLoading = false;
          console.error(error);
          this.loadEvents();
          this.autoCloseNotification(); // Chiude automaticamente la notifica
        })
      }
    });
  }
  cleanFilters(){
    if(this.canClean){
      this.filters.category = '';
      this.filters.location = '';
      this.filters.name = '';
      this.filters.date = null;;
      this.applyFilters();
    }
  }

  closeNotification() {
    this.viewNotification = false;
  }

  autoCloseNotification() {
    setTimeout(() => {
      this.viewNotification = false;
    }, 7000); // Chiude dopo 7 secondi
  }

  
  

  
}
