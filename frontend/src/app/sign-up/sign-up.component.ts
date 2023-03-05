import { Component, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

import { Router } from '@angular/router';
import { AlertsComponent } from '../alerts/alerts.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  @ViewChild(AlertsComponent) alert: AlertsComponent;

  typeAlert: string;
  msgAlert: string;

  signInForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.minLength(6),
      Validators.required,
    ]),
  });

  constructor(private authService: AuthService, private router: Router) {}

  test() {
    this.validateEmail();
    this.validateUsername();
    this.validatePassword();
    const data = this.signInForm.value;
    console.log('>>> data: ', data);

    this.authService.createAUser(data).subscribe(
      (user: any) => {
        this.typeAlert = 'success';
        this.msgAlert = user.msg;
        console.log('>>> user: ', user);
        // this.router.navigate(['/login']);
        console.log('>>> ', this.typeAlert, this.msgAlert);
      },
      (err) => {
        console.log(err);
        this.typeAlert = 'danger';
        this.msgAlert = err.error.msg;
      }
    );
  }

  validateUsername() {
    const usernameError = this.signInForm.get('username');
    if (usernameError?.hasError('required')) {
      return 'Username is empty';
    } else {
      return '';
    }
  }

  validateEmail() {
    const emailError = this.signInForm.get('email');
    if (emailError?.hasError('required')) {
      return 'Email is empty';
    } else if (emailError?.hasError('email')) {
      return 'Email is not valid';
    } else {
      return '';
    }
  }

  validatePassword() {
    const passwordError = this.signInForm.get('password');
    if (passwordError?.hasError('required')) {
      return 'Password is empty';
    } else if (passwordError?.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    } else {
      return '';
    }
  }
}
