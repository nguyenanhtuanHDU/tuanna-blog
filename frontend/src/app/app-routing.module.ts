import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ProfileComponent } from "./profile/profile.component";

const routes: Routes = [
  { path: '', component: HomeComponent, data: { preserveScrollPosition: true } },

  { path: 'login', component: LogInComponent, data: { preserveScrollPosition: true } },
  { path: 'sign-up', component: SignUpComponent, data: { preserveScrollPosition: true } },
  { path: 'profile', component: ProfileComponent, data: { preserveScrollPosition: true } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
