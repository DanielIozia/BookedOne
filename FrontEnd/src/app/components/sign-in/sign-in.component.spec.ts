import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { SignInComponent } from './sign-in.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['login']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [SignInComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: UserService, useValue: userServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create form with email and password controls', () => {
    expect(component.loginForm.contains('email')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('should make the email control required', () => {
    const control = component.loginForm.get('email');
    control?.setValue('');
    expect(control?.valid).toBeFalse();
  });

  it('should validate email format', () => {
    const control = component.loginForm.get('email');
    control?.setValue('invalid-email');
    expect(control?.valid).toBeFalse();
  });

  it('should call userService.login on form submit', () => {
    const loginUser = { email: 'test@example.com', password: 'password' };
    component.loginForm.setValue(loginUser);
    userService.login.and.returnValue(of({
      id: '1', email: 'test@example.com', password: 'password', role: 'customer', token: 'fakeToken', firstName: 'Test', lastName: 'User'
    }));

    component.onSubmit();

    expect(userService.login).toHaveBeenCalledWith(loginUser);
    expect(authService.login).toHaveBeenCalledWith('fakeToken', 'test@example.com', '1', 'Test', 'User', 'customer');
    expect(router.navigate).toHaveBeenCalledWith(['customer']);
  });

  it('should handle login error and show appropriate message', () => {
    const loginUser = { email: 'test@example.com', password: 'password' };
    component.loginForm.setValue(loginUser);
    const errorResponse = new HttpErrorResponse({
      error: { message: 'Credenziali non valide' },
      status: 401,
      statusText: 'Unauthorized'
    });
    userService.login.and.returnValue(throwError(() => errorResponse));

    component.onSubmit();

    expect(component.errorMessage).toBe('Credenziali non valide');
    expect(component.isLoading).toBeFalse();
  });

  it('should clear password on error', () => {
    const loginUser = { email: 'test@example.com', password: 'password' };
    component.loginForm.setValue(loginUser);
    const errorResponse = new HttpErrorResponse({
      error: { message: 'Credenziali non valide' },
      status: 401,
      statusText: 'Unauthorized'
    });
    userService.login.and.returnValue(throwError(() => errorResponse));

    component.onSubmit();

    // Delay the expectation to ensure password clearing has time to complete
    fixture.whenStable().then(() => {
      expect(component.loginForm.get('password')?.value).toBe('');
    });
  });
});
