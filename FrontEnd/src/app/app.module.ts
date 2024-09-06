import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';  // Usa MatFormFieldModule per l'intero modulo
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';  // Importa sia ReactiveFormsModule che FormsModule
import { HttpClient, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogReserveEventComponent } from './components/dialog-reserve-event/dialog-reserve-event.component';
import { DialogDeleteReserveEventComponent } from './components/dialog-delete-reserve-event/dialog-delete-reserve-event.component';
import { DialogLogoutComponent } from './components/dialog-logout/dialog-logout.component';
import { DeleteUserComponent } from './components/delete-user/delete-user.component';



@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignInComponent,
    PageNotFoundComponent,
    DialogReserveEventComponent,
    DialogDeleteReserveEventComponent,
    DialogLogoutComponent,
    DeleteUserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    
    
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()), 
    HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
