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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';  // Assicurati che FormsModule sia importato
import { HttpClient, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';






@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignInComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    //form
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()), // Abilita l'uso di Fetch API con HttpClient
    HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
