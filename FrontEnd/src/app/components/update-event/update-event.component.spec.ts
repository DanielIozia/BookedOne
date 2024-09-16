import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UpdateEventComponent } from './update-event.component';

//interfaces
import { EventDetails } from '../../interfaces/event/event';
import { CreateEvent } from '../../interfaces/event/createEvent';

//modules
import { MatIconModule } from '@angular/material/icon';


describe('UpdateEventComponent', () => {
  let component: UpdateEventComponent;
  let fixture: ComponentFixture<UpdateEventComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<UpdateEventComponent>>;
  const mockData: { event: EventDetails } = {
    event: {
      id: '1',
      name: 'Event Name',
      description: 'Event Description',
      location: 'Event Location',
      date: new Date(),
      time: new Date(),
      price: 100,
      category: 'Event Category',
      availableTickets: 10,
      idSeller: 'sellerId'
    }
  };

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatIconModule
    ],
      declarations: [UpdateEventComponent],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateEventComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<UpdateEventComponent>>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  

  it('should call dialogRef.close with updated event on updateEvent', () => {
    const updatedEvent: CreateEvent = {
      id: mockData.event.id,
      name: 'Updated Name',
      description: 'Updated Description',
      location: 'Updated Location',
      date: new Date(),
      time: new Date(),
      price: 150,
      category: 'Updated Category',
      availableTickets: 20,
      idSeller: mockData.event.idSeller
    };

    component.updateEventForm.patchValue({
      titolo: updatedEvent.name,
      descrizione: updatedEvent.description,
      luogo: updatedEvent.location,
      data: updatedEvent.date,
      ora: updatedEvent.time,
      prezzo: updatedEvent.price,
      categoria: updatedEvent.category,
      bigliettiDisponibili: updatedEvent.availableTickets
    });

    component.updateEvent();
    
    expect(dialogRef.close).toHaveBeenCalledWith(updatedEvent);
  });

  it('should set errorMessagePrice when checkPrice is called with invalid price', () => {
    component.updateEventForm.get('prezzo')!.setValue(-10);
    component.checkPrice();
    expect(component.errorMessagePrice).toBe('Prezzo non valido');
  });

  it('should set errorMessageAvailableTickets when checkAvailableTickets is called with invalid tickets', () => {
    component.updateEventForm.get('bigliettiDisponibili')!.setValue(-5);
    component.checkAvailableTickets();
    expect(component.errorMessageAvailableTickets).toBe('Numero di biglietti non valido');
  });

  it('should set timeErrorMessage when checkTime is called with invalid time', () => {
    const pastDate = new Date();
    pastDate.setHours(pastDate.getHours() - 2);
    
    component.updateEventForm.get('data')!.setValue(pastDate.toISOString().split('T')[0]);
    component.updateEventForm.get('ora')!.setValue('00:00');
    
    component.checkTime();
    
    expect(component.timeErrorMessage).toBe('Seleziona almeno un\'ora da adesso');
  });

  it('should close dialog on cancel', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
});
