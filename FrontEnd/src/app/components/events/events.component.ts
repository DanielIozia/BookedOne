import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';
import { EventResponse } from '../../interfaces/event/eventResponse';
import { EventDetails } from '../../interfaces/event/event';


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
  filters = {
    name: '',
    category: '',
    location: '',
    date: null
  }
  isLoading:boolean = false;
  

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.eventService.getAllEvents(this.page, this.size, this.filters.category, this.filters.location, this.filters.name, this.filters.date)
      .subscribe((response: EventResponse) => {
        this.isLoading = false;
        this.events = response.content;
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

}
