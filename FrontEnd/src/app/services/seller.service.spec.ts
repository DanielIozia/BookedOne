import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SellerService } from './seller.service';
import { AuthService } from './auth/auth.service';
import { EventResponse } from '../interfaces/event/eventResponse';
import { CreateEvent } from '../interfaces/event/createEvent';
import { EventDetails } from '../interfaces/event/event';


describe('SellerService', () => {
  let service: SellerService;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  const BASE_URL = 'https://bookedone.onrender.com/api/seller';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SellerService,
        {
          provide: AuthService,
          useValue: {
            getToken: () => 'mock-token'
          }
        }
      ]
    });

    service = TestBed.inject(SellerService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSellerEvents', () => {
    it('should return an Observable<EventResponse>', () => {
      const mockEventResponse: EventResponse = {
        content: [{
          id: '1',
          name: 'Event 1',
          description: 'Description 1',
          location: 'Location 1',
          date: new Date(),
          time: new Date(),
          price: 100,
          category: 'Category 1',
          availableTickets: 10,
          idSeller: 'seller1'
        }],
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
        size: 1,
        number: 0,
        sort: { empty: false, sorted: true, unsorted: false },
        numberOfElements: 1,
        first: true,
        empty: false
      };

      service.getSellerEvents(0, 10).subscribe(response => {
        expect(response).toEqual(mockEventResponse);
      });

      const req = httpMock.expectOne(`${BASE_URL}/seller-events`);
      expect(req.request.method).toBe('POST');
      req.flush(mockEventResponse);
    });
  });

  describe('createEvent', () => {
    it('should return an Observable<EventDetails>', () => {
      const mockEventDetails: EventDetails = {
        id: '1',
        name: 'Event 1',
        description: 'Description 1',
        location: 'Location 1',
        date: new Date(),
        time: new Date(),
        price: 100,
        category: 'Category 1',
        availableTickets: 10,
        idSeller: 'seller1'
      };

      const newEvent: CreateEvent = {
        name: 'New Event',
        description: 'New Description',
        location: 'New Location',
        date: new Date(),
        time: new Date(),
        price: 150,
        category: 'New Category',
        availableTickets: 20,
        idSeller: 'seller1'
      };

      service.createEvent(newEvent).subscribe(response => {
        expect(response).toEqual(mockEventDetails);
      });

      const req = httpMock.expectOne(`${BASE_URL}/create-event`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newEvent);
      req.flush(mockEventDetails);
    });
  });

  describe('updateEvent', () => {
    it('should return an Observable<EventDetails>', () => {
      const mockEventDetails: EventDetails = {
        id: '1',
        name: 'Updated Event',
        description: 'Updated Description',
        location: 'Updated Location',
        date: new Date(),
        time: new Date(),
        price: 200,
        category: 'Updated Category',
        availableTickets: 30,
        idSeller: 'seller1'
      };

      const updatedEvent: CreateEvent = {
        name: 'Updated Event',
        description: 'Updated Description',
        location: 'Updated Location',
        date: new Date(),
        time: new Date(),
        price: 200,
        category: 'Updated Category',
        availableTickets: 30,
        idSeller: 'seller1'
      };

      service.updateEvent(updatedEvent).subscribe(response => {
        expect(response).toEqual(mockEventDetails);
      });

      const req = httpMock.expectOne(`${BASE_URL}/update-event`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedEvent);
      req.flush(mockEventDetails);
    });
  });

  describe('deleteEvent', () => {
    it('should call DELETE method and return void', () => {
      const event: EventDetails = {
        id: '1',
        name: 'Event 1',
        description: 'Description 1',
        location: 'Location 1',
        date: new Date(),
        time: new Date(),
        price: 100,
        category: 'Category 1',
        availableTickets: 10,
        idSeller: 'seller1'
      };

      service.deleteEvent(event).subscribe( () => {
        expect(null);
      });

      const req = httpMock.expectOne(`${BASE_URL}/delete-event`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.body).toEqual(event);
      req.flush('', { status: 200, statusText: 'Ok' });
    });
  });
});
