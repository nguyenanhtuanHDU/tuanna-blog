import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

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

@NgModule({
  declarations: [AppComponent, LogInComponent, HomeComponent, SignUpComponent, HeaderComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })
    // NgxSpinnerModule.forRoot({ type: 'ball-atom' })
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
