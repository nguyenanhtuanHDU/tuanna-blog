import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from "./profile-routing.module";
import { TooltipModule } from "ngx-bootstrap/tooltip";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    TooltipModule.forRoot()
  ]
})
export class ProfileModule { }
