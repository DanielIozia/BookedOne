import { Injectable } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { ReservationEvent } from '../interfaces/reservation/reservationEvent';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservationEventResponse } from '../interfaces/reservation/reservationEventResponse';
import { Reservation } from '../interfaces/reservation/reservation';
import { ReserveEvent } from '../interfaces/event/reserveEvent';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private auth:AuthService, private http:HttpClient) { }


  private BASE_URL:string = 'http://localhost:8080/api/customer';
  private MY_RESERVATION:string = '/my-reservations';
  private DELETE_RESERVATION:string = '/delete-reservation';
  private RESERVE_EVENT:string = '/reserve-event';

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

  deleteReservation(reservation: Reservation): Observable<void> {
    const token = this.auth.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Usare HttpClient.request per passare un corpo nella richiesta DELETE
    return this.http.request<void>('DELETE', this.BASE_URL + this.DELETE_RESERVATION, {
      body: reservation,
      headers: headers,
      responseType: 'text' as 'json' 
    });
  }

  reserveEvent(event:ReserveEvent):Observable<ReservationEventResponse>{
    const token = this.auth.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ReservationEventResponse>(this.BASE_URL + this.RESERVE_EVENT, event, {headers});
  }
}
