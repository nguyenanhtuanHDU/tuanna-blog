import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from "./profile-routing.module";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { ChangePasswordComponent } from './change-password/change-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormValidatorModule } from '@popeyelab/ngx-validator';

@NgModule({
  declarations: [
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FormValidatorModule,
    TooltipModule.forRoot()
  ]
})
export class ProfileModule { }
