import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { path: 'seller-events', loadChildren: () => import('../event/event.module').then(m => m.EventsModule) },
  { path: 'profile', loadChildren: () => import('../profile/profile.module').then(m => m.ProfileModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerRoutingModule { }