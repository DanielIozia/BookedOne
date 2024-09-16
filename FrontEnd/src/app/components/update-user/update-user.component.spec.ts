import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UpdateUserComponent } from './update-user.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

describe('UpdateUserComponent', () => {
  let component: UpdateUserComponent;
  let fixture: ComponentFixture<UpdateUserComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['update', 'verifyPassword']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getToken', 'getFirstName', 'getLastName', 'login', 'getEmail', 'getId', 'getRole', 'logout'
    ]);
    
    await TestBed.configureTestingModule({
      declarations: [ UpdateUserComponent ],
      imports: [ 
        HttpClientTestingModule,
        MatIconModule,
        FormsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: UserService, useValue: userServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    })
    .compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUserComponent);
    component = fixture.componentInstance;

    authService.getToken.and.returnValue('mock-token');
    authService.getFirstName.and.returnValue('John');
    authService.getLastName.and.returnValue('Doe');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data on init', () => {
    expect(component.user.firstName).toBe('John');
    expect(component.user.lastName).toBe('Doe');
  });

  it('should call verifyPassword on button click', () => {
    userService.verifyPassword.and.returnValue(of(true));
    component.verifyPassword('password123');
    expect(userService.verifyPassword).toHaveBeenCalledWith('mock-token', 'password123');
    fixture.detectChanges();
    expect(component.passwordIsVerified).toBeTrue();
  });

  it('should handle verifyPassword error', () => {
    userService.verifyPassword.and.returnValue(throwError(() => new Error('Verification failed')));
    component.verifyPassword('password123');
    expect(userService.verifyPassword).toHaveBeenCalledWith('mock-token', 'password123');
    fixture.detectChanges();
    expect(component.passwordIsVerified).toBeFalse();
    expect(component.errorMessage).toBe('Errore durante la verifica della password');
  });

  it('should disable update button if inputs are invalid', () => {
    component.user.firstName = '';
    component.user.lastName = '';
    component.confirmPassword = 'password';
    component.newPassword = 'newpassword';
    fixture.detectChanges();
    expect(component.isAnyInputInvalid()).toBeTrue();

    component.user.firstName = 'John';
    component.user.lastName = 'Doe';
    component.confirmPassword = 'newpassword';
    fixture.detectChanges();
    expect(component.isAnyInputInvalid()).toBeFalse();
  });

  it('should call update when update button is clicked', () => {
    // Configura lo spy per restituire un oggetto che rappresenta l\'utente aggiornato
    userService.update.and.returnValue(of({ ...component.user, firstName: 'Jane' }));
  
    // Imposta i valori del componente
    component.user.firstName = 'Jane';
    component.newPassword = 'newpassword';  // Assicurati che la nuova password sia impostata
    component.passwordIsVerified = true;   // Verifica che la password sia stata verificata
  
    // Chiama il metodo update
    component.update();
  
    // Verifica che il metodo update sia stato chiamato con i parametri corretti
    expect(userService.update).toHaveBeenCalledWith('mock-token', {
      firstName: 'Jane',
      lastName: 'Doe',
      password: 'newpassword'   // Assicurati che la password sia quella che ti aspetti
    });
  });

  it('should call deleteAccount and log out when delete button is clicked', () => {
    // Usa lo spy creato in beforeEach
    const authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    const dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<UpdateUserComponent>>;
    
    // Imposta le aspettative
    authServiceSpy.logout.and.callThrough();
    spyOn(dialogRef, 'close').and.callThrough();
    
    // Chiama il metodo deleteAccount
    component.deleteAccount();
    
    // Verifica che logout sia stato chiamato
    expect(authServiceSpy.logout).toHaveBeenCalled();
    
    // Verifica che dialogRef.close sia stato chiamato con true
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});
