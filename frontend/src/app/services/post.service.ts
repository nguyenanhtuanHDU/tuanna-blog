import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";
import { Post } from "../models/post.model";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  uploadPostUrl = `${environment.apiBackend}/upload/post`;
  postUrl = `${environment.apiBackend}/v1/api/post`;

  constructor(private httpClient: HttpClient,
    private authService: AuthService) { }

  getAllPosts() {
    return this.httpClient.get<Post[]>(this.postUrl, { headers: this.authService.getHeaders() });
  }

  createPost(data: any, postImages: FileList) {
    const formData: FormData = new FormData();
    for (let i = 0; i < postImages.length; i++) {
      formData.append('postImages', postImages[i]);
    }
    formData.append('data', JSON.stringify(data))
    return this.httpClient.post(this.postUrl, formData, { headers: this.authService.getHeaders() });
  }

  updatePost(data: any) {
    return this.httpClient.put(this.postUrl + '/likers', data, { headers: this.authService.getHeaders() });
  }

  deletePost(data: any) {
    return this.httpClient.delete(this.postUrl + '/' + data, { headers: this.authService.getHeaders() });
  }
}
