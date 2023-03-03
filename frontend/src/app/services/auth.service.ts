import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userUrl = `${environment.apiBackend}v1/api/user`;
  // userUrl = `${environment.apiBackend}v1/api/users`;
  loginUrl = `${environment.apiBackend}/login`;

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) {}

  getAllUsers() {
    return this.httpClient.get(this.userUrl);
  }

  verifyLogin(data: any) {
    return this.httpClient.post(this.loginUrl, data);
  }

  setToken(token: any) {
    this.cookieService.set('email', token.email);
    this.cookieService.set('password', token.password);
  }

  getToken() {
    return this.cookieService.getAll();
  }

  resetToken() {
    this.cookieService.set('email', '');
    this.cookieService.set('password', '');
  }
}
