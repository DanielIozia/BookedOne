import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'events', pathMatch: 'full' },
  { path: 'events', loadChildren: () => import('../event/event.module').then(m => m.EventsModule) },
  { path: 'booking', loadChildren: () => import('../booking/booking.module').then(m => m.BookingModule) },
  { path: 'profile', loadChildren: () => import('../profile/profile.module').then(m => m.ProfileModule) },
  { path: 'admin', loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }