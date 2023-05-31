import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from "./admin.component";

const routes: Routes = [
  {
    path: '', component: AdminComponent,
    children: [
      {
        path: 'users',
        loadChildren: () => import('../admin/manage-user/manage-user.module').then(m => m.ManageUserModule)
      },
      {
        path: 'posts',
        loadChildren: () => import('../admin/manage-post/manage-post.module').then(m => m.ManagePostModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
