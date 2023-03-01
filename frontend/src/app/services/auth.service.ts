import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userUrl = "http://localhost:8000/v1/api/user"

  constructor(private httpClient: HttpClient) { }

  getAllUsers() {
    return this.httpClient.get(this.userUrl);
  }
}
