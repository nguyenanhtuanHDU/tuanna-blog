import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ProfileComponent } from "./profile/profile.component";
import { PostComponent } from "./post/post.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  // { path: '?page=:page&limit=:limit', component: HomeComponent },

  { path: 'login', component: LogInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'post/:id', component: PostComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
