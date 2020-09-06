import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrashDetailsPage } from './trash-details.page';

const routes: Routes = [
  {
    path: '',
    component: TrashDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrashDetailsPageRoutingModule {}
