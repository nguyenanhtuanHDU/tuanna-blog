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
}
