import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { SellerService } from '../../services/seller.service';
import { AuthService } from '../../services/auth/auth.service';
import { of, throwError } from 'rxjs'; // Per simulare l'osservabile
import { CreateEventComponent } from './create-event.component';
import { EventDetails } from '../../interfaces/event/event';
import { fakeAsync, tick } from '@angular/core/testing';

describe('CreateEventComponent', () => {
  let component: CreateEventComponent;
  let fixture: ComponentFixture<CreateEventComponent>;
  let mockSellerService: jasmine.SpyObj<SellerService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    // Mock dei servizi utilizzati dal componente
    mockSellerService = jasmine.createSpyObj('SellerService', ['createEvent']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getId']);

    await TestBed.configureTestingModule({
      declarations: [CreateEventComponent],
      imports: [ReactiveFormsModule], // Importa ReactiveFormsModule per il form
      providers: [
        FormBuilder,
        { provide: SellerService, useValue: mockSellerService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEventComponent);
    component = fixture.componentInstance;

    // Simula il valore restituito dal metodo getId dell'AuthService
    mockAuthService.getId.and.returnValue(1);

    // Inizializza il componente
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on component initialization', () => {
    expect(component.createEventForm).toBeTruthy();
    expect(component.createEventForm.get('titolo')).toBeTruthy();
    expect(component.createEventForm.get('descrizione')).toBeTruthy();
    expect(component.createEventForm.get('luogo')).toBeTruthy();
    expect(component.createEventForm.get('data')).toBeTruthy();
    expect(component.createEventForm.get('ora')).toBeTruthy();
    expect(component.createEventForm.get('categoria')).toBeTruthy();
    expect(component.createEventForm.get('prezzo')).toBeTruthy();
    expect(component.createEventForm.get('bigliettiDisponibili')).toBeTruthy();
  });

  it('should set today\'s date correctly', () => {
    const currentDate = new Date().toISOString().split('T')[0];
    expect(component.today).toEqual(currentDate);
  });  

    it('should call SellerService to create an event and reset form on success', () => {
      const mockEventDetails: EventDetails = {
        name: 'Test Event',
        description: 'This is a test event',
        location: 'Test Location',
        date: new Date('2023-09-20'),  // Usa un oggetto Date qui
        time: new Date('2023-09-20T12:00:00'),
        price: 50,
        category: 'Test Category',
        availableTickets: 100,
        idSeller: '1',
      };

      mockSellerService.createEvent.and.returnValue(of(mockEventDetails));
      spyOn(component.createEventForm, 'reset');

      component.createEvent();

      expect(mockSellerService.createEvent).toHaveBeenCalled();
      expect(component.isLoading).toBeFalse();
      expect(component.viewNotification).toBeTrue();
      expect(component.success).toBeTrue();
      expect(component.createEventForm.reset).toHaveBeenCalled();
    });

    it('should handle server error and set error messages', () => {
      const mockError = {
        error: { title: 'Errore Data', message: 'Data non valida' }
      };
      mockSellerService.createEvent.and.returnValue(throwError(mockError));

      component.createEvent();

      expect(component.isLoading).toBeFalse();
      expect(component.success).toBeFalse();
      expect(component.dataErrorMessage).toEqual('Data non valida');
      expect(component.errorMessage).toEqual('Data non valida');
    });
  

  describe('onCancel', () => {
    it('should reset the form and clear error messages', () => {
      spyOn(component.createEventForm, 'reset');
      
      component.onCancel();

      expect(component.createEventForm.reset).toHaveBeenCalled();
      expect(component.dataErrorMessage).toBeUndefined();
      expect(component.timeErrorMessage).toBeUndefined();
      expect(component.locationErrorMessage).toBeUndefined();
    });
  });

  describe('checkTime', () => {
    it('should return true and set timeErrorMessage if time is less than 1 hour from now', () => {
      const currentTime = new Date();
      const pastTime = new Date(currentTime.getTime() - 60 * 60 * 1000); // 1 ora fa

      component.createEventForm.get('data')?.setValue(component.today);
      component.createEventForm.get('ora')?.setValue(pastTime.toTimeString().slice(0, 5));

      expect(component.checkTime()).toBeTrue();
      expect(component.timeErrorMessage).toEqual('Seleziona almeno un\'ora da adesso');
    });

    it('should return false and clear timeErrorMessage if time is valid', () => {
      const validTime = new Date(new Date().getTime() + 2 * 60 * 60 * 1000); // 2 ore da adesso

      component.createEventForm.get('data')?.setValue(component.today);
      component.createEventForm.get('ora')?.setValue(validTime.toTimeString().slice(0, 5));

      expect(component.checkTime()).toBeFalse();
      expect(component.timeErrorMessage).toBeUndefined();
    });
  });

  describe('checkPrice', () => {
    it('should return true and set errorMessagePrice if price is negative', () => {
      component.createEventForm.get('prezzo')?.setValue(-5);
      expect(component.checkPrice()).toBeTrue();
      expect(component.errorMessagePrice).toEqual('Prezzo non valido');
    });

    it('should return false and clear errorMessagePrice if price is valid', () => {
      component.createEventForm.get('prezzo')?.setValue(10);
      expect(component.checkPrice()).toBeFalse();
      expect(component.errorMessagePrice).toBeUndefined();
    });
  });

  describe('checkAvailableTickets', () => {

    it('should return true and set errorMessageAvailableTickets if available tickets are <= 0', () => {
      const ticketsControl = component.createEventForm.get('bigliettiDisponibili');
      ticketsControl?.setValue(0);
      ticketsControl?.markAsTouched(); // Imposta il controllo come "touched"
      
      expect(component.checkAvailableTickets()).toBeTrue();
      expect(component.errorMessageAvailableTickets).toEqual('Numero di biglietti non valido');
    });

    it('should return false and clear errorMessageAvailableTickets if available tickets are valid', () => {
      component.createEventForm.get('bigliettiDisponibili')?.setValue(10);
      expect(component.checkAvailableTickets()).toBeFalse();
      expect(component.errorMessageAvailableTickets).toBeUndefined();
    });
  });
});

