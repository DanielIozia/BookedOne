import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { EventService } from './services/event.service';
import { BookingService } from './services/booking.service';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';



@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignInComponent,
    PageNotFoundComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideClientHydration(),
    EventService,
    BookingService,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
