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
  // btnDisable: boolean = true;

  signUpForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]),
    admin: new FormControl(false),
    password: new FormControl('', [
      Validators.minLength(6),
      Validators.required,
    ]),
    password2: new FormControl(''),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  activeSignUp() {

    const signUpFormData = this.signUpForm.value;
    if (
      !signUpFormData.email ||
      !signUpFormData.username ||
      !signUpFormData.password ||
      !signUpFormData.password2
    ) {
      Swal.fire(
        'Warning',
        'Please enter your full email and password',
        'warning'
      );
      return;
    }else{
      this.spinner.show();
      console.log('>>> data: ', signUpFormData);

      this.authService.createAUser(signUpFormData).subscribe(
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

  }

  validateUsername() {
    const username = this.signUpForm.get('username');
    console.log(username?.value);

    if (!username?.value) {
      return 'Username is empty';
    } else if (username?.value.length < 6) {
      return 'Username must be contains 6 characters';
    } else {
      return '';
    }
  }

  validateEmail() {
    const email = this.signUpForm.get('email');
    if (email?.hasError('required')) {
      return 'Email is empty';
    } else if (email?.hasError('pattern')) {
      return 'Email is not valid';
    } else {
      return '';
    }
  }

  validatePassword() {
    const password = this.signUpForm.get('password');
    if (password?.hasError('required')) {
      return 'Password is empty';
    } else if (password?.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    } else {
      return '';
    }
  }

  validatePassword2() {
    const password = this.signUpForm.get('password');
    const password2 = this.signUpForm.get('password2');
    if (password?.value !== password2?.value) {
      return 'Password is not consistent !';
    } else {
      return '';
    }
  }
}
