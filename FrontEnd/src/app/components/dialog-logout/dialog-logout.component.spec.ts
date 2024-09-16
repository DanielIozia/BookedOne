import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogLogoutComponent } from './dialog-logout.component';

describe('DialogLogoutComponent', () => {
  let component: DialogLogoutComponent;
  let fixture: ComponentFixture<DialogLogoutComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<DialogLogoutComponent>>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [ DialogLogoutComponent ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
