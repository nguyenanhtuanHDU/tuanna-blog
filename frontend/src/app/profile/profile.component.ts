import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  username: string;
  email: string;
  address: string;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserByToken().subscribe((data: any) => {
      this.username = data.username;
      this.email = data.email;
      this.address = data.address;
      console.log('>>> data profile: ', data);
    });
  }
}
