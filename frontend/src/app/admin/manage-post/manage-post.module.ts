import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagePostRoutingModule } from './manage-post-routing.module';
import { TooltipModule } from "ngx-bootstrap/tooltip";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ManagePostRoutingModule,
    TooltipModule.forRoot()
  ]
})
export class ManagePostModule { }
