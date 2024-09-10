import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateEventComponent } from '../../components/create-event/create-event.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateEventRoutingModule } from './create-event-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [
      CreateEventComponent
    ],
    imports: [
        CreateEventRoutingModule,
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatIconModule,
        
    ]
  })

export class CreateEventModule{}