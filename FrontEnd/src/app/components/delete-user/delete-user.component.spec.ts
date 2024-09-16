import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DeleteUserComponent } from './delete-user.component';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('DeleteUserComponent', () => {
  let component: DeleteUserComponent;
  let fixture: ComponentFixture<DeleteUserComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<DeleteUserComponent>>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockUserService = jasmine.createSpyObj('UserService', ['verifyPassword', 'delete']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getToken', 'getEmail']);

    await TestBed.configureTestingModule({
      declarations: [DeleteUserComponent],
      imports: [FormsModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('checkEmail', () => {
    it('should return true and clear error message for a valid email', () => {
      component.email = 'test@example.com';
      const result = component.checkEmail();
      expect(result).toBeTrue();
      expect(component.emailErrorMessage).toBe('');
    });

    it('should return false and set error message for an invalid email', () => {
      component.email = 'invalid-email';
      const result = component.checkEmail();
      expect(result).toBeFalse();
      expect(component.emailErrorMessage).toBe('Email non valida');
    });
  });

  describe('deleteAccount', () => {
    it('should set email error message if email verification fails', () => {
      spyOn(component, 'onVerifyEmail').and.returnValue(false);
      component.email = 'test@example.com';
      component.password = 'password';
      component.deleteAccount();
      expect(component.emailErrorMessage).toBe("L'email non corrisponde a questo account");
    });

    it('should set error message if password is missing', () => {
      spyOn(component, 'onVerifyEmail').and.returnValue(true);
      component.email = 'test@example.com';
      component.password = '';
      component.deleteAccount();
      expect(component.errorMessage).toBe("Inserisci la password");
    });

    it('should set error message if email is missing', () => {
        spyOn(component, 'onVerifyEmail').and.returnValue(true);
        component.email = '';
        component.password = 'password';
        component.deleteAccount();
        expect(component.emailErrorMessage).toBe("Inserisci l'email");
      });

      it('should call userService.delete and close dialog on successful deletion', fakeAsync(() => {
        // Arrange
        spyOn(component, 'onVerifyEmail').and.returnValue(true);
        component.email = 'test@example.com';
        component.password = 'password';
        mockUserService.verifyPassword.and.returnValue(of(true));
        mockUserService.delete.and.returnValue(of());
        mockAuthService.getToken.and.returnValue('token');
        mockAuthService.getEmail.and.returnValue('test@example.com');
    
        // Act
        component.deleteAccount();
        tick(); // Avanza il tempo per gestire le chiamate asincrone
        fixture.detectChanges();
    
        // Assert
        expect(mockUserService.verifyPassword).toHaveBeenCalled();
        expect(mockUserService.delete).toHaveBeenCalled();
        tick();
      }));
      

    it('should handle errors during deletion', () => {
      spyOn(component, 'onVerifyEmail').and.returnValue(true);
      component.email = 'test@example.com';
      component.password = 'password';
      mockUserService.verifyPassword.and.returnValue(of(true));
      mockUserService.delete.and.returnValue(throwError({ error: { message: 'Deletion error' } }));
      mockAuthService.getToken.and.returnValue('token');
      
      component.deleteAccount();
      fixture.detectChanges();

      expect(component.errorMessage).toBe('Deletion error');
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });
  });

  describe('onVerifyEmail', () => {
    it('should return true if email matches auth email', () => {
      mockAuthService.getEmail.and.returnValue('test@example.com');
      component.email = 'test@example.com';
      expect(component.onVerifyEmail()).toBeTrue();
    });

    it('should return false if email does not match auth email', () => {
      mockAuthService.getEmail.and.returnValue('test@example.com');
      component.email = 'other@example.com';
      expect(component.onVerifyEmail()).toBeFalse();
    });
  });

  describe('onCancel', () => {
    it('should close the dialog with false', () => {
      component.onCancel();
      expect(mockDialogRef.close).toHaveBeenCalledWith(false);
    });
  });
});
