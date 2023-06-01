import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from "./profile.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { PermisionGuard } from "../permision.guard";

const routes: Routes = [
  {
    path: ':id', component: ProfileComponent
  },
  { path: ':id/change-password', component: ChangePasswordComponent, canActivate: [PermisionGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
