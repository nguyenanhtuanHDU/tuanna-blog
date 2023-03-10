import { Component, OnInit } from '@angular/core';
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
      return;
    }
  }

  ngAfterViewChecked(): void {
    this.checkToken()
  }
  // ngAfterViewInit(): void {
  //   const token = this.authService.getToken();

  //   this.authService.getUserByToken(token).subscribe(
  //     (data) => {
  //       console.log(data);
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }
  // ngOnInit() {
  //   const token = this.authService.getToken()['token'];

  //   const userInfo = this.authService.getUserByToken(token).subscribe(data => {
  //     console.log(data);
  //   });
  // }

  // ngAfterViewChecked(){

  // }
}
