import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent {
  signInForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.minLength(6)),
  });

  emailLogin: string;
  passwordLogin: string;

  emailFocus: false

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const token = this.authService.getToken();

    if (token['email'] && token['password'] ) {
      console.log('co token');
      this.router.navigate(['/']);
    } else {
      console.log('ko co token');
      this.router.navigate(['/login']);
    }
  }

  getInforLogin() {
    const dataLogin = this.signInForm.value;
    const email = dataLogin.email;
    const password = dataLogin.password;
    console.log('email: ', email);

    if (email && password) {
      console.log('da nhap day du');
      this.emailLogin = String(email);
      this.passwordLogin = String(password);
    } else {
      console.log('chua nhap email password');
    }

    this.authService.verifyLogin(dataLogin).subscribe(
      (data: any) => {
        console.log(data);

        if (data.EC === 0) {
          console.log('>>> email pw dung');
          this.authService.setToken(dataLogin);
          this.router.navigate(['/']);
        }
      },
      (error) => {
        this.authService.resetToken();
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
}
