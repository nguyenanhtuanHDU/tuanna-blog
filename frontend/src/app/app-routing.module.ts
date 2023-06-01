import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { AuthGuard } from "./auth.guard";
import { PermisionGuard } from "./permision.guard";
import { ConfirmGuard } from "./confirm.guard";

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  // { path: '', component: HomeComponent },
  { path: 'login', component: LogInComponent },
  { path: 'sign-up', component: SignUpComponent },
  {
    path: 'profile', canLoad: [AuthGuard],
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'post', canLoad: [AuthGuard],
    loadChildren: () => import('./post/post.module').then(m => m.PostModule)
  },
  {
    path: 'admin', canLoad: [PermisionGuard],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
