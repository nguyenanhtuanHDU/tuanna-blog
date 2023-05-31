import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagePostComponent } from "./manage-post.component";

const routes: Routes = [
  { path: '', component: ManagePostComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagePostRoutingModule { }
