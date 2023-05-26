import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";
import { Notice } from "../models/notice.model";

@Injectable({
  providedIn: 'root'
})
export class NoticeService {

  private noticeUrl = `${environment.apiBackend}/v1/api/notice`;

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  getNoticesByUserID(id: string): Observable<Notice[]> {
    return this.httpClient.get<Notice[]>(this.noticeUrl + '/' + id, { headers: this.authService.getHeaders() });
  }

  resetNotices(id: string, type: string, noticeID: string) {
    const data = { type, noticeID }
    return this.httpClient.post(this.noticeUrl + '/' + id, data, { headers: this.authService.getHeaders() });
  }
}
