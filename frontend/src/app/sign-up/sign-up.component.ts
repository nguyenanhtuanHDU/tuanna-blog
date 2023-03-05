import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
  // @ViewChild(AlertsComponent) alert: AlertsComponent;
  @ViewChild(AlertsComponent) item: AlertsComponent | undefined;

  typeAlert: string;
  msgAlert: string;

  emailFocus: boolean = false;

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
        // this.router.navigate(['/login']);
      },
      (err) => {
        console.log(err);
        this.typeAlert = 'danger';
        this.msgAlert = err.error.msg;
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

  // ngOnInit(): void {
  //   // console.log('>>> alertComponent: ',this.alertComponent);

  // }

  ngAfterViewInit() {
    if(this.item){
      console.log(true);
    }
    // console.log(this.item);
    // this.alert.forEach((item) => console.log('??? item: ', item));
  }

  ngAfterContentInit() {
    if(this.item){
      console.log(true);
    }
    // console.log(this.item);
    // this.item.forEach((item) => console.log('??? item: ', item));
  }

  ngAfterViewChecked() {
    if(this.item){
      console.log(true);
    }
    // console.log(this.item);
    // this.alert.forEach((item) => console.log('??? item: ', item));
  }
}
