import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { format } from 'date-fns';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import { environment } from 'src/environments/environment';
import { Title } from "@angular/platform-browser";
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
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    birthday: new FormControl(),
    address: new FormControl(''),
    password: new FormControl('', [Validators.minLength(6)]),
    password2: new FormControl(''),
    gender: new FormControl(''),
  });
  maxDate: Date;

  videoSrc = `${environment.apiBackend}/videos/video-bg-3.mp4`;

  constructor(
    private userService: UserService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private title: Title
  ) {
    this.maxDate = new Date();
    title.setTitle("Tuanna Blog | Sign Up")
  }

  activeSignUp() {
    const signUpFormData = this.signUpForm.value
    const data = { ...signUpFormData, fullName: {} };
    data.birthday = format(new Date(data.birthday), 'dd/MM/yyyy')
    const fullName = {
      firstName: data.firstName,
      lastName: data.lastName
    }
    data.fullName = fullName
    delete data.firstName
    delete data.lastName
    console.log("👉👉👉 ~ data:", data)
    if (
      !signUpFormData.email ||
      !signUpFormData.username ||
      !signUpFormData.address ||
      !signUpFormData.password ||
      !signUpFormData.password2 ||
      !signUpFormData.firstName ||
      !signUpFormData.lastName ||
      !signUpFormData.birthday
    ) {
      Swal.fire(
        'Please complete all required fields',
        'Warning',
        'warning'
      );
      return;
    } else if (
      this.validateEmail() ||
      this.validateUsername() ||
      this.validatePassword() ||
      this.validatePassword2()
    ) {
      Swal.fire('Please fill in the correct format', 'Warning', 'warning');
    } else {
      this.spinner.show();
      this.userService.createAUser(data).subscribe(
        (user: any) => {
          this.spinner.hide();
          Swal.fire(user.msg, 'Success', 'success');
          this.router.navigate(['/login']);
        },
        (err) => {
          console.log(err);
          this.spinner.hide();
          Swal.fire(err.error.msg, 'Error', 'error');
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
      return 'You have not filled in this field';
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
