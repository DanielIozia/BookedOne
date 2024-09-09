import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';
import { EventResponse } from '../../interfaces/event/eventResponse';
import { EventDetails } from '../../interfaces/event/event';
import { MatDialog } from '@angular/material/dialog';
import { DialogReserveEventComponent } from '../dialog-reserve-event/dialog-reserve-event.component';
import { CustomerService } from '../../services/customer.service';
import { AuthService } from '../../services/auth/auth.service';
import { SellerService } from '../../services/seller.service';


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

  role:string = this.auth.getRole()!;

  constructor(private eventService: EventService, public dialog: MatDialog, private customerService: CustomerService, private auth:AuthService, private seller:SellerService) {}

  ngOnInit(): void {
    if(this.auth.getRole() == "customer"){
      this.loadEventsCustomer();
    }
    else{
      this.loadEventsSeller();
    }

  }

  loadEventsCustomer(): void {
    this.isLoading = true;
    this.eventService.getAllEvents(this.page, this.size, this.filters.category, this.filters.location, this.filters.name, this.filters.date)
      .subscribe((response: EventResponse) => {
        this.canClean = (this.filters.category || this.filters.location || this.filters.name || this.filters.date) ? true : false;
        this.isLoading = false;
        this.events = response.content;
        this.totalPages = response.totalPages;
      });
  }

  loadEventsSeller():void{
    this.isLoading = true;
    this.seller.getSellerEvents(this.page, this.size, this.filters.category, this.filters.location, this.filters.name, this.filters.date!)
    .subscribe((response: EventResponse) => {
      this.canClean = (this.filters.category || this.filters.location || this.filters.name || this.filters.date) ? true : false;
        this.isLoading = false;
        this.events = response.content;
        this.totalPages = response.totalPages;
    })

    
  }

  applyFilters(): void {
    this.page = 0;
    if(this.auth.getRole() == "customer"){
      this.loadEventsCustomer();
    }
    else{
      this.loadEventsSeller();
    }
    
  }

  nextPage(): void {
    if(this.auth.getRole() == "customer"){
      if (this.page < this.totalPages - 1) {
        this.page++;
        this.loadEventsCustomer();
      }
    }
    else{
      if (this.page < this.totalPages - 1) {
        this.page++;
        this.loadEventsSeller();
      }
    }
  }

  previousPage(): void {
    if(this.auth.getRole() == "customer"){
      if (this.page > 0) {
        this.page--;
        this.loadEventsCustomer();
      }
    }
    else{
      if (this.page > 0) {
        this.page--;
        this.loadEventsSeller();
      }
    }
  }

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
          this.loadEventsCustomer();
          this.autoCloseNotification();
        }, error => {
          this.success = false;
          this.viewNotification = true;
          this.buyEventLoading = false;
          console.error(error);
          this.loadEventsCustomer();
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

  autoCloseNotification() {
    setTimeout(() => {
      this.viewNotification = false;
    }, 5000); // Nascondi dopo 5 secondi
  }

}
