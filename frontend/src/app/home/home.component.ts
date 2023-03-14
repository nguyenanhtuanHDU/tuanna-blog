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
    } else if (token['token']) {
      console.log('>>> co token');
    }
  }

  ngOnInit(): void {
    this.checkToken();
  }

  ngDoCheck() {
    this.checkToken();
  }
}
