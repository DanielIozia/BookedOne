import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationComponent } from '../../components/reservations/reservations.component';

const routes: Routes = [
  { path: '', component: ReservationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class ReservationRoutingModule{}