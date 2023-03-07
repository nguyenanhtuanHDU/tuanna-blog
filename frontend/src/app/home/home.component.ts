import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
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
  ngAfterViewChecked() {
    setTimeout(() => {
      this.checkToken();
    }, 1000);
  }
}
