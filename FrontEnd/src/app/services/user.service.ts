import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

//interfaces
import { User } from '../interfaces/user/User';
import { LoginUser } from '../interfaces/user/loginUser';
import { updateUser } from '../interfaces/user/updateUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  dialog: any;

  constructor(private http: HttpClient) { }

  private BASE_URL = 'http://localhost:8080/api';
  private AUTH_URL = '/auth';
  private USERS_URL = '/users';
  private LOGIN_URL = '/login';
  private REGISTER_URL = '/registration';
  private ME_URL = '/me';
  private PROFILE_URL = '/profile';
  private UPDATE_URL = '/update-user';
  private DELETE_URL = '/delete-user';
  private VERIFY_PASSWORD = '/verify-password';


  login(user:LoginUser):Observable<User>{
    return this.http.post<User>(this.BASE_URL + this.AUTH_URL + this.LOGIN_URL,user);
  }

  me(token:string):Observable<User>{
    return this.http.get<User>(this.BASE_URL + this.AUTH_URL + this.ME_URL, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
    });
  }

  register(user:User):Observable<User>{
    return this.http.post<User>(this.BASE_URL + this.AUTH_URL + this.REGISTER_URL, user);
  }

  profile(token:string):Observable<User>{
    return this.http.get<User>(this.BASE_URL + this.USERS_URL + this.PROFILE_URL, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
    });
  }

  update(token:string, user:updateUser):Observable<User>{
    return this.http.put<User>(this.BASE_URL + this.USERS_URL + this.UPDATE_URL, user, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
    });
  }

  delete(token:string):Observable<void>{
    return this.http.delete<void>(this.BASE_URL + this.USERS_URL + this.DELETE_URL,{
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
    })
  }

  verifyPassword(token:string, password:string):Observable<boolean>{
    return this.http.post<boolean>(this.BASE_URL + this.USERS_URL + this.VERIFY_PASSWORD, password, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
    });
  }
}
