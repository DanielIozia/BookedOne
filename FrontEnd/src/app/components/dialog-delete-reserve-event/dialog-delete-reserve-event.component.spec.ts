import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogDeleteReserveEventComponent } from './dialog-delete-reserve-event.component';
import { AuthService } from '../../services/auth/auth.service';
import { of } from 'rxjs';

describe('DialogDeleteReserveEventComponent', () => {
  let component: DialogDeleteReserveEventComponent;
  let fixture: ComponentFixture<DialogDeleteReserveEventComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<DialogDeleteReserveEventComponent>>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getRole']);
    mockAuthService.getRole.and.returnValue('customer'); // Mock role value

    await TestBed.configureTestingModule({
      declarations: [ DialogDeleteReserveEventComponent ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { reservation: { event: { name: 'Test Event' } } } }, // Mock data
        { provide: AuthService, useValue: mockAuthService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDeleteReserveEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set role to customer from auth service', () => {
    expect(component.role).toBe('customer');
  });

  it('should set isReservation to true if reservation data is provided', () => {
    expect(component.isReservation).toBeTrue();
  });

  it('should call dialogRef.close with true on confirm', () => {
    component.onConfirm();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should call dialogRef.close with false on cancel', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });
});
