import { Injectable } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { ReservationEvent } from '../interfaces/reservation/reservationEvent';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservationEventResponse } from '../interfaces/reservation/reservationEventResponse';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private auth:AuthService, private http:HttpClient) { }


  private BASE_URL:string = 'http://localhost:8080/api/customer';
  private MY_RESERVATION:string = '/my-reservations';

  getReservations(page: number, size: number, category?: string, location?: string, name?: string, date?: string): Observable<ReservationEventResponse> {
    
    const token = this.auth.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const body = {
      page,
      size,
      category,
      location,
      name,
      date
    };

    return this.http.post<ReservationEventResponse>(this.BASE_URL + this.MY_RESERVATION, body, { headers });
  }
}
