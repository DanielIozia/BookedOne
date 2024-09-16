import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

//modules
import { FormsModule } from '@angular/forms';

// Component
import { EventsComponent } from './events.component';

// Services
import { EventService } from '../../services/event.service';
import { CustomerService } from '../../services/customer.service';
import { AuthService } from '../../services/auth/auth.service';
import { SellerService } from '../../services/seller.service';

// Interfaces
import { EventResponse } from '../../interfaces/event/eventResponse';
import { EventDetails } from '../../interfaces/event/event';

// Mock services
class MockEventService {
  getAllEvents() {
    return of(mockEventResponse);
  }
}

class MockCustomerService {}

class MockSellerService {
  getSellerEvents() {
    return of(mockEventResponse);
  }
  updateEvent(event: EventDetails) {
    return of(event); 
  }

  deleteEvent(event: EventDetails) {
    return of(null); 
  }
}

class MockAuthService {
  getRole() {
    return 'customer';
  }
  getId() {
    return 1;
  }
  getToken() {
    return 'mockToken';
  }
}

class MockMatDialog {
  open() {
    return {
      afterClosed: () => of(true)
    };
  }
}

// Mock data
const mockEventResponse: EventResponse = {
  content: [
    {
      id: '1',
      name: 'Mock Event 1',
      description: 'Description for mock event 1',
      location: 'Location 1',
      date: new Date(),
      time: new Date(),
      price: 10,
      category: 'Music',
      availableTickets: 100,
      idSeller: '1',
    }
  ],
  pageable: {
    pageNumber: 0,
    pageSize: 10,
    sort: { empty: false, sorted: true, unsorted: false },
    offset: 0,
    paged: true,
    unpaged: false
  },
  last: false,
  totalPages: 1,
  totalElements: 1,
  size: 10,
  number: 0,
  sort: { empty: false, sorted: true, unsorted: false },
  numberOfElements: 1,
  first: true,
  empty: false
};

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;
  let eventService: EventService;
  let sellerService: SellerService;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventsComponent],
      imports: [FormsModule],
      providers: [
        { provide: EventService, useClass: MockEventService },
        { provide: CustomerService, useClass: MockCustomerService },
        { provide: SellerService, useClass: MockSellerService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: MatDialog, useClass: MockMatDialog },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
    eventService = TestBed.inject(EventService);
    sellerService = TestBed.inject(SellerService);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load events for customer role', () => {
    spyOn(eventService, 'getAllEvents').and.returnValue(of(mockEventResponse));
    component.loadEventsCustomer();
    expect(component.events.length).toBe(1);
    expect(component.events[0].name).toBe('Mock Event 1');
  });

  it('should load events for seller role', () => {
    spyOn(authService, 'getRole').and.returnValue('seller');
    spyOn(sellerService, 'getSellerEvents').and.returnValue(of(mockEventResponse));
    component.ngOnInit();
    expect(component.events.length).toBe(1);
    expect(component.events[0].name).toBe('Mock Event 1');
  });

  it('should increment page and load next page', () => {
    spyOn(eventService, 'getAllEvents').and.returnValue(of(mockEventResponse));
    component.totalPages = 2;
    component.nextPage();
    expect(component.page).toBe(1);
  });

  it('should not increment page if it is the last page', () => {
    spyOn(eventService, 'getAllEvents').and.returnValue(of(mockEventResponse));
    component.totalPages = 1;
    component.nextPage();
    expect(component.page).toBe(0);
  });

  it('should apply filters and reload events for customer', () => {
    spyOn(eventService, 'getAllEvents').and.returnValue(of(mockEventResponse));
    component.filters.category = 'Music';
    component.applyFilters();
    expect(component.page).toBe(0);
    expect(component.canClean).toBe(true);
    expect(component.events[0].category).toBe('Music');
  });


it('should handle errors when loading events', fakeAsync(() => {
  spyOn(eventService, 'getAllEvents').and.returnValue(throwError(() => new Error('Errore nel caricamento degli eventi nel test')));
  component.loadEventsCustomer();
  tick(); // Simula il completamento delle operazioni asincrono
  expect(component.isLoading).toBe(false);
}));


  it('should open the update event dialog', () => {
    const event: EventDetails = mockEventResponse.content[0];
    const dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.callThrough();
    component.updateEvent(event);
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('should open the delete event dialog', () => {
    const event: EventDetails = mockEventResponse.content[0];
    const dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.callThrough();
    component.deleteEvent(event);
    expect(dialogSpy).toHaveBeenCalled();
  });
});
