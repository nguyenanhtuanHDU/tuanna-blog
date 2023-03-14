import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userUrl = `${environment.apiBackend}/v1/api/user`;
  userInfoUrl = `${environment.apiBackend}/v1/api/user-info`;
  // userUrl = `${environment.apiBackend}v1/api/users`;
  loginUrl = `${environment.apiBackend}/auth/login`;
  signupUrl = `${environment.apiBackend}/auth/signup`;
  uploadUrl = `${environment.apiBackend}/upload/avatar`;

  constructor(
    private httpClient: HttpClient,
    @Inject(CookieService) private cookieService: CookieService
  ) {}

  getAllUsers() {
    return this.httpClient.get(this.userUrl);
  }

  getUserByToken() {
    return this.httpClient.post(this.userInfoUrl, this.getToken());
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
    this.cookieService.deleteAll();
  }

  uploadAvatar(data: File, nameInputFile: string) {
    const token = this.getToken()['token'];
    const formData: FormData = new FormData();
    formData.append(nameInputFile, data);
    formData.append('token', token);
    return this.httpClient.post(this.uploadUrl, formData);
  }

  checkToken() {
    const token = this.getToken()['token'];
    console.log('>>> check token: ', token);

    if (token) {
      console.log('>>> co token');
      return true;
    } else if (!token || token.includes('Object') || token.includes('object')) {
      console.log('>>> ko co token');
      return false;
    } else {
      console.log('>>> ko co token');
      return false;
    }
  }
}
