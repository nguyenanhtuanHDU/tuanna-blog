import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent {
  signInForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.minLength(6)]),
  });

  emailLogin: string;
  passwordLogin: string;

  emailFocus: false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngAfterViewInit(): void {
    const token = this.authService.getToken();
    if (
      token['token'] &&
      !token['token'].includes('Object') &&
      !token['token'].includes('object')
    ) {
      console.log('co token');
      this.router.navigate(['/']);
    } else {
      console.log('ko co token');
      this.spinner.show();
      this.router.navigate(['/login']);
      this.spinner.hide();
    }
  }

  activeLogin() {
    this.spinner.show();

    const dataLogin = this.signInForm.value;

    if (!dataLogin.email || !dataLogin.password) {
      this.spinner.hide();

      Swal.fire(
        'Warning',
        'Please enter your full email and password',
        'warning'
      );
      return;
    }

    this.authService.verifyLogin(dataLogin).subscribe(
      (data: any) => {
        this.spinner.hide();
        Swal.fire('Success', data.msg, 'success');
        this.authService.setToken(data.token);
        this.router.navigate(['/']);
      },
      (error) => {
        this.spinner.hide();

        Swal.fire('Error', error.error.msg, 'error');

        this.authService.logOut();
        console.log(this.authService.getToken());

        const statusCode = error.status;
        if (statusCode === 401) {
          console.error('Invalid email and password');
        } else {
          console.error('server error');
        }
      }
    );
    this.authService.setToken(this.signInForm.value);
  }

  validatePassword() {
    const password = this.signInForm.get('password');
    if (password?.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    } else {
      return '';
    }
  }
}
