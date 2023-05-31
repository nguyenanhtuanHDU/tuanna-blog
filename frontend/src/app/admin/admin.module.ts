import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from "./admin-routing.module";
import { TooltipModule } from "ngx-bootstrap/tooltip";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    TooltipModule.forRoot()
  ]
})
export class AdminModule { }
