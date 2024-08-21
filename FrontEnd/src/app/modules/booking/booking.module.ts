import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingComponent } from '../../components/booking/booking.component';
import { BookingRoutingModule } from './booking-routing.module';

@NgModule({
  declarations: [
    BookingComponent
  ],
  imports: [
    CommonModule,
    BookingRoutingModule
    
  ]
})


export class BookingModule {}