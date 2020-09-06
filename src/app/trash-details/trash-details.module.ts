import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrashDetailsPageRoutingModule } from './trash-details-routing.module';

import { TrashDetailsPage } from './trash-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrashDetailsPageRoutingModule
  ],
  declarations: [TrashDetailsPage]
})
export class TrashDetailsPageModule {}
