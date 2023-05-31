import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageUserRoutingModule } from './manage-user-routing.module';
import { TooltipModule } from "ngx-bootstrap/tooltip";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ManageUserRoutingModule,
    TooltipModule.forRoot()
  ]
})
export class ManageUserModule { }
