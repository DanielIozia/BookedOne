import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EventsComponent } from "../../components/events/events.component";
import { EventDetailComponent } from "../../components/event-detail/event-detail.component";
import { EventsRoutingModule } from "./event-routing.module";


@NgModule({
    declarations: [
      EventsComponent,
      EventDetailComponent
    ],
    imports: [
      CommonModule,
      EventsRoutingModule

    ]
  })


export class EventsModule {}

