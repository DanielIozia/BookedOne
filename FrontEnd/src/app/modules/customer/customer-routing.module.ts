import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'events', pathMatch: 'full' },
  { path: 'events', loadChildren: () => import('../event/event.module').then(m => m.EventsModule) },
  { path: 'reservations', loadChildren: () => import('../reservations/reservation.module').then(m => m.ReservationModule) },
  { path: 'profile', loadChildren: () => import('../profile/profile.module').then(m => m.ProfileModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }