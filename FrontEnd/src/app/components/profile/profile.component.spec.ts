import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from '../../services/customer.service';
import { SellerService } from '../../services/seller.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { User } from '../../interfaces/user/User';
import { ReservationEventResponse } from '../../interfaces/reservation/reservationEventResponse';
import { EventResponse } from '../../interfaces/event/eventResponse';


describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let authService: jasmine.SpyObj<AuthService>;
  let customerService: jasmine.SpyObj<CustomerService>;
  let sellerService: jasmine.SpyObj<SellerService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['profile']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken', 'getRole']);
    const customerServiceSpy = jasmine.createSpyObj('CustomerService', ['getReservations']);
    const sellerServiceSpy = jasmine.createSpyObj('SellerService', ['getSellerEvents']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  
    // Definisci i ritorni per i metodi dei servizi mock
    userServiceSpy.profile.and.returnValue(of({})); // Può essere modificato con un valore mock effettivo
    authServiceSpy.getToken.and.returnValue('mock-token');
    authServiceSpy.getRole.and.returnValue('mock-role');
    customerServiceSpy.getReservations.and.returnValue(of({})); // Può essere modificato con un valore mock effettivo
    sellerServiceSpy.getSellerEvents.and.returnValue(of({})); // Può essere modificato con un valore mock effettivo
    dialogSpy.open.and.returnValue({ afterClosed: () => of(true) } as any);
  
    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: CustomerService, useValue: customerServiceSpy },
        { provide: SellerService, useValue: sellerServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();
  
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    customerService = TestBed.inject(CustomerService) as jasmine.SpyObj<CustomerService>;
    sellerService = TestBed.inject(SellerService) as jasmine.SpyObj<SellerService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data on initialization', () => {
    const user: User = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', role: 'customer', password: 'password' };
    authService.getToken.and.returnValue('mock-token');
    userService.profile.and.returnValue(of(user)); 
    
    fixture.detectChanges();
  
    expect(component.user).toEqual(user);
    expect(component.isLoading).toBeFalse();
  });
  
  it('should handle error while loading user data', () => {
    authService.getToken.and.returnValue('mock-token');
    userService.profile.and.returnValue(throwError(() => new Error('Errore nel caricamento del profilo'))); 
    fixture.detectChanges();
  
    expect(component.isLoading).toBeFalse();
  });
  

  it('should load reservations if role is customer', () => {
    const reservationResponse: ReservationEventResponse = {
      content: [{
        reservation: {
          id: '1',
          userId: 'user1',
          eventId: 'event1',
          numberOfTickets: 2,
          bookingDate: '2024-09-15',
          totalPrice: 50
        },
        event: {
          id: 'event1',
          name: 'Event 1',
          description: 'Description of Event 1',
          location: 'Location 1',
          date: new Date('2024-09-20'),
          time: new Date('2024-09-20T15:00:00'),
          price: 25,
          category: 'Category 1',
          availableTickets: 100,
          idSeller: 'seller1'
        }
      }],
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
      last: false,
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
    authService.getRole.and.returnValue('customer');
    customerService.getReservations.and.returnValue(of(reservationResponse));

    fixture.detectChanges();

    expect(component.reservedEvents).toBe(1);
    expect(component.isLoadingReservation).toBeFalse();
  });

  it('should load seller events if role is seller', () => {
    const eventResponse: EventResponse = {
      content: [{
        id: 'event1',
        name: 'Event 1',
        description: 'Description of Event 1',
        location: 'Location 1',
        date: new Date('2024-09-20'),
        time: new Date('2024-09-20T15:00:00'),
        price: 25,
        category: 'Category 1',
        availableTickets: 100,
        idSeller: 'seller1'
      }],
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
      last: false,
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
    authService.getRole.and.returnValue('seller');
    sellerService.getSellerEvents.and.returnValue(of(eventResponse));

    fixture.detectChanges();

    expect(component.myEvent).toBe(1);
    expect(component.isLoadinEventSeller).toBeFalse();
  });

  it('should open update profile dialog and handle success', () => {
    const dialogRef = {
      afterClosed: () => of(true)
    };
    dialog.open.and.returnValue(dialogRef as any);

    component.update();

    expect(dialog.open).toHaveBeenCalled();
  });

  it('should navigate to reservations page', () => {
    component.goToReservations();
    expect(router.navigate).toHaveBeenCalledWith(['/customer/reservations']);
  });

  it('should navigate to events page', () => {
    component.goToEvents();
    expect(router.navigate).toHaveBeenCalledWith(['/seller/seller-events']);
  });

  

});
