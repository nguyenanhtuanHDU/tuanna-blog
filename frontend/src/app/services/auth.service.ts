import { Injectable , Inject} from '@angular/core';
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

  createAUser(data: any) {
    console.log('>>> data: ', data);
    return this.httpClient.post(this.signupUrl, data);
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
