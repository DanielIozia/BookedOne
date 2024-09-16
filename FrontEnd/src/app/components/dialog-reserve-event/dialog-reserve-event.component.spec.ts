import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms'; // Per ngModel
import { DialogReserveEventComponent } from './dialog-reserve-event.component';
import { EventDetails } from '../../interfaces/event/event';

import { MatIconModule } from '@angular/material/icon';

describe('DialogReserveEventComponent', () => {
  let component: DialogReserveEventComponent;
  let fixture: ComponentFixture<DialogReserveEventComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<DialogReserveEventComponent>>;

  // Mock dei dati dell'evento
  const mockEvent: EventDetails = {
    id: '123',
    name: 'Test Event',
    description: 'Test Description',
    location: 'Test Location',
    date: new Date('2024-09-15T10:00:00Z'),
    time: new Date('2024-09-15T12:00:00Z'),
    price: 20,
    category: 'Test Category',
    availableTickets: 10,
    idSeller: 'seller-456'
  };

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [ DialogReserveEventComponent ],
      imports: [ FormsModule,MatIconModule ], // Importa FormsModule per ngModel
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockEvent }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogReserveEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tickets to 1', () => {
    expect(component.tickets).toBe(1);
  });

  it('should have no error message initially', () => {
    expect(component.errorMessage).toBeNull();
  });

  it('should set error message if tickets are less than 1', () => {
    component.tickets = 0;
    component.onPurchase();
    expect(component.errorMessage).toBe('Numero di biglietti non valido');
  });

  it('should set error message if tickets exceed available tickets', () => {
    component.tickets = 15;
    component.onPurchase();
    expect(component.errorMessage).toBe('Numero di biglietti non disponibili');
  });

  it('should call dialogRef.close with correct data on valid purchase', () => {
    component.tickets = 2;
    component.onPurchase();
    expect(component.errorMessage).toBeNull();
    expect(mockDialogRef.close).toHaveBeenCalledWith({
      event: mockEvent,
      numberOfTickets: component.tickets
    });
  });

  it('should call dialogRef.close without data on cancel', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith();
  });
});
