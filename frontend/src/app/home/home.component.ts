import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  username: string = '';
  email: string = '';
  constructor(private authService: AuthService, private router: Router) {}

  checkToken() {
    const token = this.authService.getToken();
    if (
      !token['token'] ||
      token['token'].includes('Object') ||
      token['token'].includes('object')
    ) {
      this.router.navigate(['/login']);
      console.log('>>> ko co token');
      return;
    } else {
      console.log('>>> co token');
    }
  }

  getUserInfo() {
    const token = this.authService.getToken();
    console.log('>>> token: ', token);

    this.authService.getUserByToken(token).subscribe(
      (data: any) => {
        console.log(data);
        this.username = data.username;
        this.email = data.email;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  ngOnInit(): void {
    this.checkToken();
    this.getUserInfo();
  }

  ngDoCheck(){
    this.checkToken();
  }
}
