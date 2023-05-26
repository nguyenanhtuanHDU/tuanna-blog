import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userUrl = `${environment.apiBackend}/v1/api/user`;

  // userUrl = `${environment.apiBackend}v1/api/users`;
  loginUrl = `${environment.apiBackend}/auth/login`;
  signupUrl = `${environment.apiBackend}/auth/signup`;

  constructor(
    private httpClient: HttpClient,
    @Inject(CookieService) private cookieService: CookieService
  ) { }

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
    this.cookieService.deleteAll();
    return this.httpClient.get(`${this.userUrl}/clear-redis`).subscribe(data => {
      console.log("👉👉👉 ~ data:", data)
    })
  }

  checkToken() {
    const token = this.getToken()['token'];
    if (token) {
      return true;
    } else if (!token || token.includes('Object') || token.includes('object')) {
      return false;
    } else {
      return false;
    }
  }

  getHeaders() {
    const headers = new HttpHeaders({
      token: `Bearer ${this.getToken()['token']}`,
    });
    return headers
  }
}
