import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userUrl = `${environment.apiBackend}v1/api/user`;
  // userUrl = `${environment.apiBackend}v1/api/users`;
  loginUrl = `${environment.apiBackend}/auth/login`;
  signupUrl = `${environment.apiBackend}/auth/signup`;

  constructor(
    private httpClient: HttpClient,
    @Inject(CookieService) private cookieService: CookieService
  ) {}

  getAllUsers() {
    return this.httpClient.get(this.userUrl);
  }

  getUserByID(id: string) {
    return this.httpClient.get(`${this.userUrl}${id}`);
  }
  createAUser(data: any) {
    return this.httpClient.post(this.signupUrl, data);
  }

  verifyLogin(data: any) {
    return this.httpClient.post(this.loginUrl, data);
  }

  setToken(data: any) {
    this.cookieService.set('token', data);
  }

  getToken() {
    return this.cookieService.getAll();
  }

  logOut() {
    // this.cookieService.set('token', '');
    this.cookieService.deleteAll()
  }
}
