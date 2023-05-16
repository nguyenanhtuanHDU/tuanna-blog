import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { AuthService } from "./auth.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  commentUrl = `${environment.apiBackend}/v1/api/comment`;

  constructor(private httpClient: HttpClient,
    private authService: AuthService) { }

  createPost(data: any) {
    return this.httpClient.post(this.commentUrl, data, { headers: this.authService.getHeaders() });
  }

  updateComment(data: any, id: string) {
    return this.httpClient.put(this.commentUrl + '/' + id, data, { headers: this.authService.getHeaders() });
  }

  deleteComment(id: string) {
    return this.httpClient.delete(this.commentUrl + '/' + id, { headers: this.authService.getHeaders() });
  }
}
