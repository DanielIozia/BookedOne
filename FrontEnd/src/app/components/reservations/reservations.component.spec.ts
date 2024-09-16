import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReservationComponent } from './reservations.component';
import { CustomerService } from '../../services/customer.service';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReservationEventResponse } from '../../interfaces/reservation/reservationEventResponse';
import { ReservationEvent } from '../../interfaces/reservation/reservationEvent';

// Mock per MatDialog
class MockMatDialog {
  open() {
    return {
      afterClosed: () => of(true)  // Simula una risposta di conferma (true)
    } as any;
  }
}

// Mock della classe CustomerService
class MockCustomerService {
  getReservations() {
    return of({ 
      content: [] as ReservationEvent[], 
      totalPages: 0, 
      totalElements: 0, 
      size: 0,
      number: 0,
      last: true,
      pageable: {} as any,
      sort: { empty: true, sorted: false, unsorted: true },
      numberOfElements: 0,
      first: true,
      empty: true
    } as ReservationEventResponse);
  }

  deleteReservation() {
    return of({});
  }
}

describe('ReservationComponent', () => {
  let component: ReservationComponent;
  let fixture: ComponentFixture<ReservationComponent>;
  let customerService: CustomerService;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservationComponent ],
      imports: [
        FormsModule,
        MatDialogModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: CustomerService, useClass: MockCustomerService },
        { provide: MatDialog, useClass: MockMatDialog }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignora i tag sconosciuti nel template
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationComponent);
    component = fixture.componentInstance;
    customerService = TestBed.inject(CustomerService);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load reservations on init', () => {
    const spy = spyOn(customerService, 'getReservations').and.callThrough();
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should apply filters and reload reservations', () => {
    const spy = spyOn(customerService, 'getReservations').and.returnValue(of({
      content: [] as ReservationEvent[], 
      totalPages: 1, 
      totalElements: 1, 
      size: 10,
      number: 0,
      last: false,
      pageable: {} as any,
      sort: { empty: true, sorted: false, unsorted: true },
      numberOfElements: 1,
      first: true,
      empty: false
    } as ReservationEventResponse));
    
    component.category = 'Concert';
    component.applyFilters();
    expect(spy).toHaveBeenCalled();
  });

  it('should handle pagination correctly', fakeAsync(() => {
    component.currentPage = 0;
    component.totalPages = 2; // Imposta manualmente totalPages
    
    // Simula la chiamata getReservations con un contenuto non vuoto
    const spy = spyOn(customerService, 'getReservations').and.returnValue(of({
      content: [{}] as ReservationEvent[], // Non vuoto
      totalPages: 2, 
      totalElements: 20, 
      size: 10,
      number: 0,
      last: false,
      pageable: {} as any,
      sort: { empty: true, sorted: false, unsorted: true },
      numberOfElements: 10,
      first: true,
      empty: false
    } as ReservationEventResponse));
    
    // Chiamata a nextPage()
    component.nextPage();
    tick();
    // Verifica che getReservations sia stato chiamato con i parametri corretti
    expect(spy).toHaveBeenCalledWith(1, component.pageSize, component.category, component.location, component.name, component.date, component.expired);
    
    // Verifica che currentPage sia aggiornato
    expect(component.currentPage).toBe(1);
  }));

  
  
  

  it('should not increment currentPage if there are no more pages', fakeAsync(() => {
    component.currentPage = 1;
    component.totalPages = 2; // Imposta manualmente totalPages
    
    // Simula la chiamata getReservations
    const spy = spyOn(customerService, 'getReservations').and.returnValue(of({
      content: [{}] as ReservationEvent[], 
      totalPages: 2, 
      totalElements: 20, 
      size: 10,
      number: 1,
      last: true, // Indica che è l'ultima pagina
      pageable: {} as any,
      sort: { empty: true, sorted: false, unsorted: true },
      numberOfElements: 10,
      first: false,
      empty: false
    } as ReservationEventResponse));
    
    // Prova a passare alla pagina successiva
    component.nextPage();
    tick();

    // Verifica che getReservations NON sia stato chiamato perché siamo sull'ultima pagina
    expect(spy).not.toHaveBeenCalledWith(2, component.pageSize, component.category, component.location, component.name, component.date, component.expired);
    
    // Verifica che currentPage non sia cambiato
    expect(component.currentPage).toBe(1);
  }));




  it('should delete a reservation and reload reservations', () => {
    const deleteSpy = spyOn(customerService, 'deleteReservation').and.returnValue(of());
    const dialogRefSpy = spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of(true)  // Simula una risposta di conferma (true)
    } as any);
    
    component.deleteReservation({} as ReservationEvent);
    expect(deleteSpy).toHaveBeenCalled();
  });

  it('should handle errors on loading reservations', () => {
    spyOn(customerService, 'getReservations').and.returnValue(throwError(() => new Error('Error')));
    component.loadReservations();
    expect(component.isLoading).toBeFalse();
  });

  it('should handle errors on deleting reservation', () => {
    spyOn(customerService, 'deleteReservation').and.returnValue(throwError(() => new Error('Error')));
    component.deleteReservation({} as ReservationEvent);
    expect(component.success).toBeFalse();
    expect(component.viewNotification).toBeTrue();
  });

  it('should reset filters correctly', () => {
    component.category = 'Concert';
    component.canClean = true;
    component.cleanFilters();
    expect(component.category).toBeUndefined();
    expect(component.location).toBeUndefined();
    expect(component.name).toBeUndefined();
    expect(component.date).toBeUndefined();
    expect(component.expired).toBeFalse();
  });
});
