import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let localStorageMock: any;

  beforeEach(() => {
    // Crea un mock di localStorage
    localStorageMock = {
      store: {} as { [key: string]: string },
      getItem: (key: string) => localStorageMock.store[key] || null,
      setItem: (key: string, value: string) => { localStorageMock.store[key] = value; },
      removeItem: (key: string) => { delete localStorageMock.store[key]; },
      clear: () => { localStorageMock.store = {}; }
    };

    // Sostituisci localStorage con il mock
    spyOnProperty(window, 'localStorage').and.returnValue(localStorageMock);

    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);

    // Pulire il mock di localStorage prima di ogni test
    localStorageMock.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should set the correct values in localStorage and update isLoggedIn', () => {
      const token = 'dummy-token';
      const email = 'user@example.com';
      const id = '1';
      const firstName = 'John';
      const lastName = 'Doe';
      const role = 'user';

      service.login(token, email, id, firstName, lastName, role);

      expect(localStorageMock.getItem('token')).toBe(token);
      expect(localStorageMock.getItem('email')).toBe(email);
      expect(localStorageMock.getItem('id')).toBe(id);
      expect(localStorageMock.getItem('firstName')).toBe(firstName);
      expect(localStorageMock.getItem('lastName')).toBe(lastName);
      expect(localStorageMock.getItem('role')).toBe(role);
      expect(service.isLoggedIn).toBeTrue();
    });
  });

  describe('logout', () => {
    it('should clear all localStorage items and set isLoggedIn to false', () => {
      // Simula un login per testare il logout
      const token = 'dummy-token';
      localStorageMock.setItem('token', token);
      service.isLoggedIn = true;

      service.logout();

      expect(localStorageMock.getItem('token')).toBeNull();
      expect(localStorageMock.getItem('email')).toBeNull();
      expect(localStorageMock.getItem('id')).toBeNull();
      expect(localStorageMock.getItem('firstName')).toBeNull();
      expect(localStorageMock.getItem('lastName')).toBeNull();
      expect(localStorageMock.getItem('role')).toBeNull();
      expect(service.isLoggedIn).toBeFalse();
    });
  });

  describe('getToken', () => {
    it('should return the token from localStorage if in browser', () => {
      const token = 'dummy-token';
      localStorageMock.setItem('token', token);

      expect(service.getToken()).toBe(token);
    });

    it('should return null if not in browser', () => {
      // Mock per simulare ambiente non browser
      spyOn(service as any, 'isBrowser').and.returnValue(false);

      expect(service.getToken()).toBeNull();
    });
  });

  describe('getEmail', () => {
    it('should return the email from localStorage if in browser', () => {
      const email = 'user@example.com';
      localStorageMock.setItem('email', email);

      expect(service.getEmail()).toBe(email);
    });

    it('should return null if not in browser', () => {
      // Mock per simulare ambiente non browser
      spyOn(service as any, 'isBrowser').and.returnValue(false);

      expect(service.getEmail()).toBeNull();
    });
  });

  describe('getId', () => {
    it('should return the ID from localStorage if in browser', () => {
      const id = '1';
      localStorageMock.setItem('id', id);

      expect(service.getId()).toBe(1);
    });

    it('should return null if not in browser', () => {
      // Mock per simulare ambiente non browser
      spyOn(service as any, 'isBrowser').and.returnValue(false);

      expect(service.getId()).toBeNull();
    });
  });

  describe('getFirstName', () => {
    it('should return the first name from localStorage if in browser', () => {
      const firstName = 'John';
      localStorageMock.setItem('firstName', firstName);

      expect(service.getFirstName()).toBe(firstName);
    });

    it('should return null if not in browser', () => {
      // Mock per simulare ambiente non browser
      spyOn(service as any, 'isBrowser').and.returnValue(false);

      expect(service.getFirstName()).toBeNull();
    });
  });

  describe('getLastName', () => {
    it('should return the last name from localStorage if in browser', () => {
      const lastName = 'Doe';
      localStorageMock.setItem('lastName', lastName);

      expect(service.getLastName()).toBe(lastName);
    });

    it('should return null if not in browser', () => {
      // Mock per simulare ambiente non browser
      spyOn(service as any, 'isBrowser').and.returnValue(false);

      expect(service.getLastName()).toBeNull();
    });
  });

  describe('getRole', () => {
    it('should return the role from localStorage if in browser', () => {
      const role = 'user';
      localStorageMock.setItem('role', role);

      expect(service.getRole()).toBe(role);
    });

    it('should return null if not in browser', () => {
      // Mock per simulare ambiente non browser
      spyOn(service as any, 'isBrowser').and.returnValue(false);

      expect(service.getRole()).toBeNull();
    });
  });
});
