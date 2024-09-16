import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EventResponse } from '../interfaces/event/eventResponse';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private BASE_URL = 'http://localhost:8080/api/customer'
  private ALL_EVENTS = "/all-events"


  constructor(private http:HttpClient, private auth:AuthService) { }
  
  getAllEvents(page: number, size: number, category: string | null = null, location: string | null = null, name: string | null = null, date: string | null = null): Observable<EventResponse> {

    const token = this.auth.getToken(); // Recupera il token dal servizio AuthService

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Aggiungi il token come Bearer token
    });

    const body = {
      page: page,
      size: size,
      category: category,
      location: location,
      name: name,
      date: date
    };

    

    return this.http.post<EventResponse>(`${this.BASE_URL}${this.ALL_EVENTS}`, body, {headers});
  }

}
