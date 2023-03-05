import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

import { Router } from '@angular/router';
import { Alert } from '../models/all.model';
import { AlertComponent } from 'ngx-bootstrap/alert';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  typeAlert: string;
  msgAlert: string;

  dismissible = true;
  emailFocus: boolean = false;
  alerts: Alert[] = [
    {
      type: 'success',
      msg: 'ádadddddddd',
      timeout: 300000,
    },
    {
      type: 'success',
      msg: 'ádadddddddd',
      timeout: 300000,
    },    {
      type: 'success',
      msg: 'ádadddddddd',
      timeout: 300000,
    },
  ];

  onClosed(dismissedAlert: any): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  signInForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.minLength(6),
      Validators.required,
    ]),
  });

  constructor(private authService: AuthService, private router: Router) {}

  // onClosed(dismissedAlert: AlertComponent): void {
  //   this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  // }

  test() {
    this.validateEmail();
    this.validateUsername();
    this.validatePassword();
    const data = this.signInForm.value;
    console.log('>>> data: ', data);

    this.authService.createAUser(data).subscribe(
      (user: any) => {
        // this.alerts.push({
        //   type: 'success',
        //   msg: user.msg,
        // });
        // this.typeAlert = 'success';
        // this.msgAlert = user.msg;
        // this.router.navigate(['/login']);
      },
      (err) => {
        console.log(err);
        // this.alerts.push({
        //   type: 'danger',
        //   msg: err.error.msg,
        // });
      }
    );
  }

  validateUsername() {
    const username = this.signInForm.get('username');
    if (username?.hasError('required')) {
      return 'Username is empty';
    } else {
      return '';
    }
  }

  validateEmail() {
    const email = this.signInForm.get('email');
    if (email?.hasError('required')) {
      this.emailFocus = true;
      return 'Email is empty';
    } else if (email?.hasError('email')) {
      return 'Email is not valid';
    } else {
      return '';
    }
  }

  validatePassword() {
    const password = this.signInForm.get('password');
    if (password?.hasError('required')) {
      return 'Password is empty';
    } else if (password?.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    } else {
      return '';
    }
  }
}
