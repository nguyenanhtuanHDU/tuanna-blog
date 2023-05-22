import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class NoticeService {

  private noticeUrl = `${environment.apiBackend}/v1/api/notice`;

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  getNoticesByUserID(id: string) {
    return this.httpClient.get(this.noticeUrl + '/' + id, { headers: this.authService.getHeaders() });
  }

  resetNotices(id: string, type: string, userID: string, postID: string) {
    const data = { type, userID,postID }
    return this.httpClient.post(this.noticeUrl + '/' + id, data, { headers: this.authService.getHeaders() });
  }
}
