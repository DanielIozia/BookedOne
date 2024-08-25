import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { UserService } from '../user.service';
import { User } from '../../interfaces/user/User';

class MockAuthService {
  getToken() {
    return 'mockToken';
  }

  logout() {}
}

class MockUserService {
  me(token: string) {
    return of({ email: 'test@example.com', password: 'password', role: 'customer', firstName: 'John', lastName: 'Doe' } as User);
  }
}

class MockRouter {
  navigate(path: string[]) {}
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let userService: UserService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useClass: MockAuthService },
        { provide: UserService, useClass: MockUserService },
        { provide: Router, useClass: MockRouter }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if user is authenticated and role matches', fakeAsync(() => {
    spyOn(userService, 'me').and.returnValue(of({ email: 'test@example.com', password: 'password', role: 'customer', firstName: 'John', lastName: 'Doe' } as User));
    spyOn(router, 'navigate');

    const route = { data: { role: 'customer' } } as any;
    const state = {} as any;

    guard.canActivate(route, state).subscribe(result => {
      expect(result).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    tick();
  }));

  it('should deny access if user role does not match', fakeAsync(() => {
    spyOn(userService, 'me').and.returnValue(of({ email: 'test@example.com', password: 'password', role: 'seller', firstName: 'John', lastName: 'Doe' } as User));
    spyOn(router, 'navigate');

    const route = { data: { role: 'customer' } } as any;
    const state = {} as any;

    guard.canActivate(route, state).subscribe(result => {
      expect(result).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    tick();
  }));

  it('should deny access if user is not authenticated', fakeAsync(() => {
    spyOn(authService, 'getToken').and.returnValue(null);
    spyOn(authService, 'logout');
    spyOn(router, 'navigate');

    const route = { data: { role: 'customer' } } as any;
    const state = {} as any;

    guard.canActivate(route, state).subscribe(result => {
      expect(result).toBeFalse();
      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    tick();
  }));

  it('should handle errors from user service', fakeAsync(() => {
    spyOn(userService, 'me').and.returnValue(throwError(() => new Error('Error')));
    spyOn(router, 'navigate');

    const route = { data: { role: 'customer' } } as any;
    const state = {} as any;

    guard.canActivate(route, state).subscribe(result => {
      expect(result).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    tick();
  }));
});
