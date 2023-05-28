import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";
import { Post } from "../models/post.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  uploadPostUrl = `${environment.apiBackend}/upload/post`;
  postUrl = `${environment.apiBackend}/v1/api/post`;
  listPostUrl = `${environment.apiBackend}/v1/api/posts`;

  constructor(private httpClient: HttpClient,
    private authService: AuthService) { }

  getAllPosts(page: number = 1, limit: number = 4, userID: string = ''): Observable<Post[]> {
    return this.httpClient.get<Post[]>(this.postUrl + '?page=' + page + '&limit=' + limit + '&userID=' + userID, { headers: this.authService.getHeaders() });
  }

  getPostByID(id: string): Observable<Post> {
    return this.httpClient.get<Post>(this.postUrl + '/' + id, { headers: this.authService.getHeaders() });
  }

  getPostsByTag(tagName: string, page: number, limit: number): Observable<Post> {
    return this.httpClient.get<Post>(this.listPostUrl + '/filter?tag=' + tagName + '&page=' + page + '&limit=' + limit, { headers: this.authService.getHeaders() });
  }

  getPostsByTitle(title: string): Observable<Post> {
    return this.httpClient.get<Post>(this.listPostUrl + '/filter?title=' + title, { headers: this.authService.getHeaders() });
  }

  getTopViewer(top: number): Observable<Post[]> {
    return this.httpClient.get<Post[]>(this.postUrl + '/top-viewer/' + top, { headers: this.authService.getHeaders() });
  }

  getTopLikes(top: number): Observable<Post[]> {
    return this.httpClient.get<Post[]>(this.postUrl + '/top-likes/' + top, { headers: this.authService.getHeaders() });
  }

  getTopComments(top: number): Observable<Post[]> {
    return this.httpClient.get<Post[]>(this.postUrl + '/top-comments/' + top, { headers: this.authService.getHeaders() });
  }

  createPost(data: any, postImages: FileList) {
    const formData: FormData = new FormData();
    for (let i = 0; i < postImages.length; i++) {
      formData.append('postImages', postImages[i]);
    }
    formData.append('data', JSON.stringify(data))
    return this.httpClient.post(this.postUrl, formData, { headers: this.authService.getHeaders() });
  }

  updatePost(data: any, id: string, postImages: FileList) {
    const formData: FormData = new FormData();
    if (postImages?.length > 0) {
      for (let i = 0; i < postImages?.length; i++) {
        formData.append('postImages', postImages[i]);
      }
    }

    formData.append('data', JSON.stringify(data))

    return this.httpClient.put(this.postUrl + '/' + id, formData, { headers: this.authService.getHeaders() });
  }

  updatePostViews(id: string) {
    return this.httpClient.put(this.postUrl + '/' + id + '/viewer', null, { headers: this.authService.getHeaders() });
  }

  deletePost(data: any) {
    return this.httpClient.delete(this.postUrl + '/' + data, { headers: this.authService.getHeaders() });
  }
}
