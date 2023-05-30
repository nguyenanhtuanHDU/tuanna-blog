import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostRoutingModule } from "./post-routing.module";
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PostRoutingModule,
    TooltipModule.forRoot()
  ]
})
export class PostModule { }
