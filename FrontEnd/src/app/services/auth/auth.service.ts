import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean;

  constructor() {
    this.isLoggedIn = false;

    if (this.isBrowser()) {
      const token = localStorage.getItem('token');
      this.isLoggedIn = !!token; // Imposta isLoggedIn a true se il token esiste
    }
  }

  login(token: string, email: string, id: string, firstName: string, lastName: string, role: string) {
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      localStorage.setItem('id', id);
      localStorage.setItem('firstName', firstName);
      localStorage.setItem('lastName', lastName);
      localStorage.setItem('role', role);
      this.isLoggedIn = true;
    }
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.clear();
      this.isLoggedIn = false;
    }
  }

  getToken() {
    return this.isBrowser() ? localStorage.getItem('token') : null;
  }

  getEmail() {
    return this.isBrowser() ? localStorage.getItem('email') : null;
  }

  getId() {
    return this.isBrowser() ? parseInt(localStorage.getItem('id')!, 10) : null;
  }

  getFirstName() {
    return this.isBrowser() ? localStorage.getItem('firstName') : null;
  }

  getLastName() {
    return this.isBrowser() ? localStorage.getItem('lastName') : null;
  }

  getRole() {
    return this.isBrowser() ? localStorage.getItem('role') : null;
  }

  // Funzione helper per verificare se è disponibile l'ambiente del browser
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}
