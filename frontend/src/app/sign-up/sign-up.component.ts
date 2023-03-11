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
  signUpForm = new FormGroup({
    username: new FormControl('', [Validators.minLength(6)]),
    email: new FormControl('', [
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]),
    address: new FormControl(''),
    admin: new FormControl(false),
    password: new FormControl('', [Validators.minLength(6)]),
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
      !signUpFormData.address ||
      !signUpFormData.password ||
      !signUpFormData.password2
    ) {
      Swal.fire(
        'Warning',
        'Please enter your full email and password',
        'warning'
      );
      return;
    } else if (
      this.validateEmail() ||
      this.validateUsername() ||
      this.validatePassword() ||
      this.validatePassword2()
    ) {
      Swal.fire('Warning', 'Please fill in the correct format', 'warning');
    } else {
      this.spinner.show();
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

  validateEmail() {
    const email = this.signUpForm.get('email');
    if (email?.hasError('pattern')) {
      return 'Email is not in the correct format';
    } else {
      return '';
    }
  }

  validateUsername() {
    const username = this.signUpForm.get('username');
    if (username?.hasError('minlength')) {
      return 'Username must be contains 6 characters';
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
