import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EventsComponent } from "../../components/events/events.component";
import { EventsRoutingModule } from "./event-routing.module";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";





@NgModule({
    declarations: [
      EventsComponent,
    ],
    imports: [
      CommonModule,
      EventsRoutingModule,
      FormsModule,
      MatIconModule
    ]
  })


export class EventsModule {}

