import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserService } from '../user.service';
import { User } from '../../interfaces/user/User';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    
    //controllo se c'è il token
    if (this.authService.getToken() == null) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return of(false);
    } 

    //se c'è, verifico se è valido
    else {
      return this.userService.me(this.authService.getToken()!).pipe(
        map((user: User) => {
          if (user) {
            return true;
          } 
          else {
            this.router.navigate(['/login']);
            return false;
          }
        }),
        catchError((error) => {
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    }
  }
}