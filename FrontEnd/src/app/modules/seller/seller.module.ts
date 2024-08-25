import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerComponent } from '../../components/seller/seller.component';
import { SellerRoutingModule } from './seller-routing.module';


// Material Modules
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';





@NgModule({
  declarations: [
    SellerComponent
  ],
  imports: [
    CommonModule,
    SellerRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatIcon,
    MatIconButton
  ]
})

export class SellerModule {}

