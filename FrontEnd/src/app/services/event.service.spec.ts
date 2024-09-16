import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventService } from './event.service';
import { AuthService } from './auth/auth.service';
import { EventResponse } from '../interfaces/event/eventResponse';


describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EventService,
        {
          provide: AuthService,
          useValue: {
            getToken: () => 'mock-token'
          }
        }
      ]
    });

    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllEvents', () => {
    it('should make a POST request and return the event response', () => {
      const mockResponse: EventResponse = {
        content: [
          {
            id: '1',
            name: 'Event 1',
            description: 'Description 1',
            location: 'Location 1',
            date: new Date('2024-01-01T00:00:00Z'),
            time: new Date('2024-01-01T10:00:00Z'),
            price: 100,
            category: 'Category 1',
            availableTickets: 10,
            idSeller: 'Seller1'
          }
        ],
        pageable: {
          pageNumber: 0,
          pageSize: 10,
          sort: {
            empty: false,
            sorted: true,
            unsorted: false
          },
          offset: 0,
          paged: true,
          unpaged: false
        },
        last: true,
        totalPages: 1,
        totalElements: 1,
        size: 1,
        number: 0,
        sort: {
          empty: false,
          sorted: true,
          unsorted: false
        },
        numberOfElements: 1,
        first: true,
        empty: false
      };

      const page = 1;
      const size = 10;
      const category = 'Music';
      const location = 'New York';
      const name = 'Concert';
      const date = '2024-01-01';

      service.getAllEvents(page, size, category, location, name, date).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(req => req.method === 'POST' && req.url === 'http://localhost:8080/api/customer/all-events');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-token');
      expect(req.request.body).toEqual({
        page,
        size,
        category,
        location,
        name,
        date
      });
      req.flush(mockResponse);
    });
  });
});
