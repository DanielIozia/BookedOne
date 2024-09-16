import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { SignUpComponent } from './sign-up.component';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user/User';
import { HttpErrorResponse } from '@angular/common/http';

// Mock AuthService
class MockAuthService {
  login() {}
}

// Mock UserService
class MockUserService {
  register() { return of({} as User); }
}

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let userService: UserService;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [ SignUpComponent ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: UserService, useClass: MockUserService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form', () => {
    const { registerForm } = component;
    expect(registerForm.valid).toBeFalsy();

    registerForm.controls['firstName'].setValue('John');
    registerForm.controls['lastName'].setValue('Doe');
    registerForm.controls['email'].setValue('john.doe@example.com');
    registerForm.controls['password'].setValue('password123');
    registerForm.controls['confirmPassword'].setValue('password123');
    registerForm.controls['ruolo'].setValue('cliente');

    expect(registerForm.valid).toBeTruthy();
  });

  it('should display error message when passwords do not match', () => {
    component.registerForm.controls['password'].setValue('password123');
    component.registerForm.controls['confirmPassword'].setValue('password124');
    component.onSubmit();
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Le password non corrispondono');
  });

  it('should call UserService register and navigate on successful registration', () => {
    spyOn(userService, 'register').and.returnValue(of({
      id: '1',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'customer',
      firstName: 'John',
      lastName: 'Doe',
      token: 'fake-token'
    } as User));
    spyOn(authService, 'login');
    spyOn(component['router'], 'navigate');
    
    component.registerForm.controls['firstName'].setValue('John');
    component.registerForm.controls['lastName'].setValue('Doe');
    component.registerForm.controls['email'].setValue('john.doe@example.com');
    component.registerForm.controls['password'].setValue('password123');
    component.registerForm.controls['confirmPassword'].setValue('password123');
    component.registerForm.controls['ruolo'].setValue('cliente');

    component.onSubmit();
    fixture.detectChanges();

    expect(userService.register).toHaveBeenCalled();
    expect(authService.login).toHaveBeenCalledWith('fake-token', 'john.doe@example.com', '1', 'John', 'Doe', 'customer');
    expect(component['router'].navigate).toHaveBeenCalledWith(['customer']);
  });

  it('should display error message on registration failure', () => {
    const errorResponse = new HttpErrorResponse({
      error: { title: 'Email già esistente' },
      status: 400
    });
    spyOn(userService, 'register').and.returnValue(throwError(() => errorResponse));

    component.registerForm.controls['firstName'].setValue('John');
    component.registerForm.controls['lastName'].setValue('Doe');
    component.registerForm.controls['email'].setValue('john.doe@example.com');
    component.registerForm.controls['password'].setValue('password123');
    component.registerForm.controls['confirmPassword'].setValue('password123');
    component.registerForm.controls['ruolo'].setValue('cliente');

    component.onSubmit();
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Email già esistente');
  });
});
