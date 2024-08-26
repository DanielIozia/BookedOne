import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationComponent } from '../../components/reservations/reservations.component';
import { ReservationRoutingModule } from './reservation-routing.module';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    ReservationComponent
  ],
  imports: [
    CommonModule,
    ReservationRoutingModule,
    FormsModule
  ]
})


export class ReservationModule{}