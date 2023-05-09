import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';

  constructor(
    private authService: AuthService,
    private cookieService: CookieService
  ) {}

  reset() {
    this.authService.logOut();
    const token = this.authService.getToken();
    console.log('>>> token after reset: ', token);
  }

  addToken() {
    this.cookieService.set('email', 'tuan_3@gmail.com');
    this.cookieService.set('password', 'pw_3');
    const token = this.authService.getToken();
    console.log('>>> token after add: ', token);
  }
  logToken() {
    console.log("token: ", this.authService.getToken());
  }
  // ngOnInit(): void {
  //   this.reset()
  // }
}
