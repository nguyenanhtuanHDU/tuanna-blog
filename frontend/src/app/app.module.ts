import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogInComponent } from './log-in/log-in.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HeaderComponent } from './header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ProfileComponent } from './profile/profile.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgOptimizedImage } from '@angular/common';
import { tokenInterceptor } from './token.injectable';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxSlickJsModule } from "ngx-slickjs";
import { PostComponent } from './post/post.component';
import { TagViewComponent } from './tag-view/tag-view.component';
import { PostTopComponent } from './post-top/post-top.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    HomeComponent,
    SignUpComponent,
    HeaderComponent,
    ProfileComponent,
    PostComponent,
    TagViewComponent,
    PostTopComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    NgScrollbarModule,
    NgOptimizedImage,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    FontAwesomeModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    NgxSkeletonLoaderModule.forRoot({
      animation: 'pulse',
      theme: { margin: 0 },
    }),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgxSlickJsModule.forRoot(),
    PaginationModule.forRoot(),
    PaginationModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: tokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
