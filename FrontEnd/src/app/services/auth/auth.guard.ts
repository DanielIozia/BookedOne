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
    const expectedRole = route.data['role'] as 'customer' | 'seller';

    if (this.authService.getToken() == null) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return of(false);
    }

    return this.userService.me(this.authService.getToken()!).pipe(
      map((user: User) => {
        if (user) {
          if (expectedRole && user.role !== expectedRole) {
            // Libera il localStorage e reindirizza alla pagina di login
            this.authService.logout();
            this.router.navigate(['/login']);
            return false;
          }
          return true;
        } else {
          this.authService.logout();
          this.router.navigate(['/login']);
          return false;
        }
      }),
      catchError((error) => {
        this.authService.logout();
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
