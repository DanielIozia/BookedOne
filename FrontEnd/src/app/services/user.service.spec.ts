import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../interfaces/user/User';
import { LoginUser } from '../interfaces/user/loginUser';
import { updateUser } from '../interfaces/user/updateUser';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should return an Observable<User>', () => {
      const dummyUser: User = {
        id: '1',
        email: 'test@example.com',
        password: 'password',
        role: 'customer',
        firstName: 'Test',
        lastName: 'User',
        token: 'some-token'
      };
      const loginUser: LoginUser = {
        email: 'test@example.com',
        password: 'password'
      };

      service.login(loginUser).subscribe(user => {
        expect(user).toEqual(dummyUser);
      });

      const req = httpMock.expectOne(service['BASE_URL'] + service['AUTH_URL'] + service['LOGIN_URL']);
      expect(req.request.method).toBe('POST');
      req.flush(dummyUser);
    });
  });

  describe('me', () => {
    it('should return an Observable<User>', () => {
      const dummyUser: User = {
        id: '1',
        email: 'test@example.com',
        password: 'password',
        role: 'customer',
        firstName: 'Test',
        lastName: 'User',
        token: 'some-token'
      };
      const token = 'some-token';

      service.me(token).subscribe(user => {
        expect(user).toEqual(dummyUser);
      });

      const req = httpMock.expectOne(service['BASE_URL'] + service['AUTH_URL'] + service['ME_URL']);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeTrue();
      expect(req.request.headers.get('Authorization')).toBe('Bearer ' + token);
      req.flush(dummyUser);
    });
  });

  describe('register', () => {
    it('should return an Observable<User>', () => {
      const dummyUser: User = {
        id: '1',
        email: 'test@example.com',
        password: 'password',
        role: 'customer',
        firstName: 'Test',
        lastName: 'User',
        token: 'some-token'
      };
      const newUser: User = {
        email: 'test@example.com',
        password: 'password',
        role: 'customer',
        firstName: 'Test',
        lastName: 'User'
      };

      service.register(newUser).subscribe(user => {
        expect(user).toEqual(dummyUser);
      });

      const req = httpMock.expectOne(service['BASE_URL'] + service['AUTH_URL'] + service['REGISTER_URL']);
      expect(req.request.method).toBe('POST');
      req.flush(dummyUser);
    });
  });

  describe('profile', () => {
    it('should return an Observable<User>', () => {
      const dummyUser: User = {
        id: '1',
        email: 'test@example.com',
        password: 'password',
        role: 'customer',
        firstName: 'Test',
        lastName: 'User',
        token: 'some-token'
      };
      const token = 'some-token';

      service.profile(token).subscribe(user => {
        expect(user).toEqual(dummyUser);
      });

      const req = httpMock.expectOne(service['BASE_URL'] + service['USERS_URL'] + service['PROFILE_URL']);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeTrue();
      expect(req.request.headers.get('Authorization')).toBe('Bearer ' + token);
      req.flush(dummyUser);
    });
  });

  describe('update', () => {
    it('should return an Observable<User>', () => {
      const dummyUser: User = {
        id: '1',
        email: 'test@example.com',
        password: 'password',
        role: 'customer',
        firstName: 'Updated',
        lastName: 'User',
        token: 'some-token'
      };
      const updatedUser: updateUser = {
        firstName: 'Updated',
        lastName: 'User',
        password: 'newpassword'
      };
      const token = 'some-token';

      service.update(token, updatedUser).subscribe(user => {
        expect(user).toEqual(dummyUser);
      });

      const req = httpMock.expectOne(service['BASE_URL'] + service['USERS_URL'] + service['UPDATE_URL']);
      expect(req.request.method).toBe('PUT');
      expect(req.request.headers.has('Authorization')).toBeTrue();
      expect(req.request.headers.get('Authorization')).toBe('Bearer ' + token);
      req.flush(dummyUser);
    });
  });

  describe('delete', () => {
    it('should perform a DELETE request', () => {
      const token = 'some-token';
  
      service.delete(token).subscribe((response:void) => {
        // `response` dovrebbe essere `undefined` per una chiamata DELETE senza corpo di risposta
        expect(response).toBeUndefined();
      });
  
      const req = httpMock.expectOne(service['BASE_URL'] + service['USERS_URL'] + service['DELETE_URL']);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.has('Authorization')).toBeTrue();
      expect(req.request.headers.get('Authorization')).toBe('Bearer ' + token);
      req.flush({}); // `flush` può essere passato con un oggetto vuoto o senza argomenti
    });
  });
  

  describe('verifyPassword', () => {
    it('should return an Observable<boolean>', () => {
      const token = 'some-token';
      const password = 'password';

      service.verifyPassword(token, password).subscribe(result => {
        expect(result).toBeTrue();
      });

      const req = httpMock.expectOne(service['BASE_URL'] + service['USERS_URL'] + service['VERIFY_PASSWORD']);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.has('Authorization')).toBeTrue();
      expect(req.request.headers.get('Authorization')).toBe('Bearer ' + token);
      req.flush(true);
    });
  });
});
