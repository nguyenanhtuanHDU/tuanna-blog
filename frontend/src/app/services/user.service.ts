import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Observable } from "rxjs";
import { User } from "../models/user.model";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  uploadAvatarUrl = `${environment.apiBackend}/upload/avatar`;
  uploadBgUrl = `${environment.apiBackend}/upload/bg`;
  userInfoUrl = `${environment.apiBackend}/v1/api/user-info`;
  userUrl = `${environment.apiBackend}/v1/api/user`;
  signupUrl = `${environment.apiBackend}/auth/signup`;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) { }

  getUserInfo(): Observable<User> {
    return this.httpClient.get<User>(this.userInfoUrl, { headers: this.authService.getHeaders() });
  }

  getListAdmin(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.userUrl + '/list-admins', { headers: this.authService.getHeaders() });
  }

  getNonAdminUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.userUrl + '/list-users', { headers: this.authService.getHeaders() });
  }

  getUserByID(id: string): Observable<User> {
    return this.httpClient.get<User>(this.userUrl + '/' + id, { headers: this.authService.getHeaders() });
  }

  createAUser(data: any): Observable<User> {
    return this.httpClient.post<User>(this.signupUrl, data);
  }

  uploadAvatar(avatarList: FileList) {
    const formData: FormData = new FormData();
    for (let i = 0; i < avatarList.length; i++) {
      formData.append("avatars", avatarList[i]);
    }
    return this.httpClient.post(this.uploadAvatarUrl, formData, { headers: this.authService.getHeaders() });
  }

  uploadBg(bgList: FileList) {
    const formData: FormData = new FormData();
    for (let i = 0; i < bgList.length; i++) {
      formData.append('bgs', bgList[i]);
    }
    return this.httpClient.post(this.uploadBgUrl, formData, { headers: this.authService.getHeaders() });
  }

  updateAUser(data: any) {
    return this.httpClient.put(this.userUrl, data, { headers: this.authService.getHeaders() });
  }

  updateAUserByAdmin(userID: string, data: any) {
    console.warn('service', data);

    return this.httpClient.put(this.userUrl + '/' + userID, data, { headers: this.authService.getHeaders() });
  }

  updatePassword(idUser: string, oldPassword: string, newPassword: string) {
    return this.httpClient.put(
      `${environment.apiBackend}/v1/api/user/${idUser.trim()}/password`,
      { oldPassword, newPassword },
      { headers: this.authService.getHeaders() }
    );
  }

  updateAvatar(idUser: string, data: any) {
    return this.httpClient.put(
      `${environment.apiBackend}/v1/api/user/${idUser.trim()}/avatar`,
      { avatar: data },
      { headers: this.authService.getHeaders() }
    );
  }

  updateBgAvatar(idUser: string, bgAvatar: any) {
    return this.httpClient.put(
      `${environment.apiBackend}/v1/api/user/${idUser.trim()}/bgAvatar`,
      { bgAvatar: bgAvatar },
      { headers: this.authService.getHeaders() }
    );
  }

  updateLikes(data: any, userID: string) {
    return this.httpClient.put(
      `${environment.apiBackend}/v1/api/user/${userID}/likes`,
      data,
      { headers: this.authService.getHeaders() }
    );
  }

  deleteUserByID(id: string) {
    return this.httpClient.delete(
      `${environment.apiBackend}/v1/api/user/${id}`,
      { headers: this.authService.getHeaders() }
    );
  }

  deleteAvatar(idUser: string, avatar: string) {
    return this.httpClient.delete(
      `${environment.apiBackend}/v1/api/user/${idUser}/listAvatars/${avatar}`,
      { headers: this.authService.getHeaders() }
    );
  }

  deleteBgAvatar(idUser: string, bgAvatar: string) {
    return this.httpClient.delete(
      `${environment.apiBackend}/v1/api/user/${idUser}/listBgAvatars/${bgAvatar}`,
      { headers: this.authService.getHeaders() }
    );
  }
}
