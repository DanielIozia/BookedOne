import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user/User';
import { LoginUser } from '../interfaces/user/loginUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  private BASE_URL = 'http://localhost:8080/api/auth';
  private USERS_URL = '/users';
  private LOGIN_URL = '/login';
  private REGISTER_URL = '/registration';
  private ME_URL = '/me';
  private PROFILE_URL = '/profile';
  private UPDATE_URL = '/update-user';
  private DELETE_URL = '/delete-user';


  login(user:LoginUser):Observable<User>{
    return this.http.post<User>(this.BASE_URL + this.LOGIN_URL,user);
  }

  me(token:string):Observable<User>{
    return this.http.get<User>(this.BASE_URL + this.ME_URL, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
    });
  }

  register(user:User):Observable<User>{
    return this.http.post<User>(this.BASE_URL + this.REGISTER_URL, user);
  }




  
}
