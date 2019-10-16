import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceListComponent } from './main/invoice-list/invoice-list.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';

const routes: Routes = [
  {path: '', component: InvoiceListComponent},
  {path: 'dashboard', component: DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
