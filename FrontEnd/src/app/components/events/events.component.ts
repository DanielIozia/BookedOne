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
  buyEventLoading: boolean = false;
  success: boolean | undefined = undefined;
  viewNotification: boolean = false;

  filters = {
    name: '',
    category: '',
    location: '',
    date: null
  }
  isLoading: boolean = false;
  canClean: boolean = false;

  constructor(private eventService: EventService, public dialog: MatDialog, private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.eventService.getAllEvents(this.page, this.size, this.filters.category, this.filters.location, this.filters.name, this.filters.date)
      .subscribe((response: EventResponse) => {
        this.canClean = (this.filters.category || this.filters.location || this.filters.name || this.filters.date) ? true : false;
        this.isLoading = false;
        this.events = response.content;
        this.totalPages = response.totalPages;
      });
  }

  applyFilters(): void {
    this.page = 0;
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

  /*
  let dialogWidth = '70%';
    let dialogHeight = '60%';
  
    if (window.innerWidth <= 768) { // Schermi piccoli come tablet o cellulari
      dialogWidth = '95%';
      dialogHeight = '70%';
    } 
    else if (window.innerWidth > 768 && window.innerWidth <= 1024) { // Schermi medi come tablet
      dialogWidth = '85%';
      dialogHeight = '70%';
    }
  
    const dialogRef = this.dialog.open(UpdateUserComponent, {
      width: dialogWidth,
      height: dialogHeight,
      data: { user: this.user }
    });
  */

  openDialogReserveEvent(event: EventDetails): void {
    let dialogWidth = '50%';
    

    // Imposta la larghezza dinamica in base alla larghezza della finestra
    if (window.innerWidth <= 768) { // Schermi piccoli come tablet o cellulari
      dialogWidth = '95%';
   
    } 
    else if (window.innerWidth > 768 && window.innerWidth <= 1024) { // Schermi medi come tablet
      dialogWidth = '85%';
   
    }
  
    const dialogRef = this.dialog.open(DialogReserveEventComponent, {
      width: dialogWidth,
   
      data: event
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.buyEventLoading = true;
        this.customerService.reserveEvent(result).subscribe(data => {
          this.success = true;
          this.viewNotification = true;
          this.buyEventLoading = false;
          this.loadEvents();
          this.autoCloseNotification();
        }, error => {
          this.success = false;
          this.viewNotification = true;
          this.buyEventLoading = false;
          console.error(error);
          this.loadEvents();
          this.autoCloseNotification();
        })
      }
    });
  }

  cleanFilters() {
    if (this.canClean) {
      this.filters.category = '';
      this.filters.location = '';
      this.filters.name = '';
      this.filters.date = null;
      this.applyFilters();
    }
  }

  closeNotification() {
    this.viewNotification = false;
  }

  autoCloseNotification() {
    setTimeout(() => {
      this.viewNotification = false;
    }, 5000); // Nascondi dopo 5 secondi
  }

}
