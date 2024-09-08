import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EventsComponent } from "../../components/events/events.component";
import { EventsRoutingModule } from "./event-routing.module";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';




@NgModule({
    declarations: [
      EventsComponent,
    ],
    imports: [
      CommonModule,
      EventsRoutingModule,
      FormsModule,
      MatIconModule,
      MatDatepickerModule,
      MatFormFieldModule,
      MatInputModule,
    ],
    providers: [
    ],
  })


export class EventsModule {}

