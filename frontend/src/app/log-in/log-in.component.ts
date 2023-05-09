import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent {
  @ViewChild('videoRef', { static: true }) videoRef!: ElementRef;

  signInForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.minLength(6)]),
  });
  protected aFormGroup: FormGroup;
  emailLogin: string;
  passwordLogin: string;
  videoSrc = `${environment.apiBackend}/videos/video-bg-1.mp4`;

  constructor(
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private title: Title
  ) {
    title.setTitle("Tuanna Blog | Login")
  }

  ngAfterViewInit(): void {
    const media = this.videoRef.nativeElement;
    media.muted = true;
    media.play();
    const token = this.authService.getToken();
    if (
      token['token'] &&
      !token['token'].includes('Object') &&
      !token['token'].includes('object')
    ) {
      console.log('co token');
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
        'Please enter your full email and password',
        'Warning',
        'warning'
      );
      return;
    }

    this.authService.verifyLogin(dataLogin).subscribe(
      (data: any) => {
        this.spinner.hide();
        Swal.fire(data.msg, 'Success', 'success');
        this.authService.setToken(data.token);
        this.router.navigate(['/']);
      },
      (error) => {
        this.spinner.hide();

        Swal.fire(error.error.msg, 'Error', 'error');

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
