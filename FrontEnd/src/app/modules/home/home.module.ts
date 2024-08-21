import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../../components/home/home.component';
import { HomeRoutingModule } from './home-routing.module';


// Material Modules
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';



@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,

    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatIcon,
    MatIconButton

    
    
  ]
})

export class HomeModule {}

