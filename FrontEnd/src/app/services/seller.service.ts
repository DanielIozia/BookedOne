import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs';
import { EventResponse } from '../interfaces/event/eventResponse';
import { CreateEvent } from '../interfaces/event/createEvent';
import { EventDetails } from '../interfaces/event/event';

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  constructor(private http:HttpClient, private auth:AuthService) { }

  // CreaEvento:/api/seller/create-event
  // UpdateEvento:/api/seller/update-event
  // CancellaEvento:/api/seller/delete-event
  // EventiCreati:/api/seller/seller-events

  private BASE_URL = 'http://localhost:8080/api/seller'
  private CREATE_EVENT = '/create-event'
  private UPDATE_EVENT = '/update-event'
  private DELETE_EVENT = '/delete-event'
  private EVENTS = '/seller-events'


  getSellerEvents(page: number, size: number, category?: string, location?: string, name?: string, date?: string, expired?:boolean): Observable<EventResponse>{

    const token = this.auth.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const body = { page, size, category, location, name, date, expired };

    return this.http.post<EventResponse>(this.BASE_URL + this.EVENTS, body, { headers });
  }


  createEvent(event:CreateEvent):Observable<EventDetails>{

    const token = this.auth.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<EventDetails>(this.BASE_URL + this.CREATE_EVENT, event, {headers});
  }

  updateEvent(event:CreateEvent):Observable<EventDetails>{
    const token = this.auth.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<EventDetails>(this.BASE_URL + this.UPDATE_EVENT, event, {headers});
  }

  deleteEvent(event: EventDetails): Observable<void> {
    const token = this.auth.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.request<void>('DELETE',this.BASE_URL + this.DELETE_EVENT, {
      body: event,
      headers: headers,
      responseType: 'text' as 'json' 
    });
  }

}
