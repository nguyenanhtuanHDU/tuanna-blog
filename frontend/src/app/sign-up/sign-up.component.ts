import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  emailFocus: boolean = false;

  signInForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.minLength(6),
      Validators.required,
    ]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  test() {
    this.spinner.show();
    this.validateEmail();
    this.validateUsername();
    this.validatePassword();
    const data = this.signInForm.value;
    console.log('>>> data: ', data);

    this.authService.createAUser(data).subscribe(
      (user: any) => {
        this.spinner.hide();
        Swal.fire('Success', user.msg, 'success');

        this.router.navigate(['/login']);
      },
      (err) => {
        console.log(err);

        this.spinner.hide();
        Swal.fire('Error', err.error.msg, 'error');
        console.log(err);
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
