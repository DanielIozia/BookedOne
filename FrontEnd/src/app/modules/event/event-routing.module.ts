import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from '../../components/events/events.component';
import { EventDetailComponent } from '../../components/event-detail/event-detail.component';

const routes: Routes = [
  { path: '', component: EventsComponent },
  { path: ':id', component: EventDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
  
  
  export class EventsRoutingModule { }