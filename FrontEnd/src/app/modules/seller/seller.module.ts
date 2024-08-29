import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerComponent } from '../../components/seller/seller.component';
import { SellerRoutingModule } from './seller-routing.module';


import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';





@NgModule({
  declarations: [
    SellerComponent
  ],
  imports: [
    CommonModule,
    SellerRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatIcon
  ]
})

export class SellerModule {}

