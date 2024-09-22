import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth/auth.service';
import { CustomerService } from './customer.service';
import { ReservationEventResponse } from '../interfaces/reservation/reservationEventResponse';
import { Reservation } from '../interfaces/reservation/reservation';
import { ReserveEvent } from '../interfaces/event/reserveEvent';
import { EventDetails } from '../interfaces/event/event';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;

  const dummyToken = 'dummy-token';
  const baseUrl = 'https://bookedone.onrender.com/api/customer';

  beforeEach(() => {
    const spyAuth = jasmine.createSpyObj('AuthService', ['getToken']);
    spyAuth.getToken.and.returnValue(dummyToken);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CustomerService,
        { provide: AuthService, useValue: spyAuth }
      ]
    });

    service = TestBed.inject(CustomerService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getReservations', () => {
    it('should return expected reservations', () => {
      const mockResponse: ReservationEventResponse = {
        content: [],
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
        totalElements: 0,
        size: 10,
        number: 0,
        sort: { empty: false, sorted: true, unsorted: false },
        numberOfElements: 0,
        first: true,
        empty: true
      };

      service.getReservations(0, 10).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/my-reservations`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${dummyToken}`);
      req.flush(mockResponse);
    });
  });

  describe('deleteReservation', () => {
    it('should delete a reservation', () => {
      const reservation: Reservation = {
        id: '1',
        userId: 'user123',
        eventId: 'event123',
        numberOfTickets: 2,
        bookingDate: '2024-09-16T00:00:00Z',
        totalPrice: 50
      };

      service.deleteReservation(reservation).subscribe( () => {
        expect(null);
      });

      const req = httpMock.expectOne(`${baseUrl}/delete-reservation`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.body).toEqual(reservation);
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${dummyToken}`);
      req.flush('', { status: 200, statusText: 'OK' });
    });
  });

  describe('reserveEvent', () => {
    it('should reserve an event and return reservation response', () => {
      const mockResponse: ReservationEventResponse = {
        content: [],
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
        totalElements: 0,
        size: 10,
        number: 0,
        sort: { empty: false, sorted: true, unsorted: false },
        numberOfElements: 0,
        first: true,
        empty: true
      };
      const event: ReserveEvent = {
        event: {
          id: 'event123',
          name: 'Event Name',
          description: 'Event Description',
          location: 'Event Location',
          date: new Date('2024-09-16T00:00:00Z'),
          time: new Date('2024-09-16T12:00:00Z'),
          price: 50,
          category: 'Concert',
          availableTickets: 100,
          idSeller: 'seller123'
        },
        numberOfTickets: 2
      };

      service.reserveEvent(event).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/reserve-event`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${dummyToken}`);
      expect(req.request.body).toEqual(event);
      req.flush(mockResponse);
    });
  });
});
