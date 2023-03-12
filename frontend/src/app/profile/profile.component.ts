import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  username: string;
  email: string;
  address: string;
  avatarData: any;
  avatarFileName: string;
  avatarPath: string;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserByToken().subscribe((data: any) => {
      this.username = data.username;
      this.email = data.email;
      this.address = data.address;
    });
  }

  chooseFile(file: FileList) {
    console.log('>>> files: ', file);
    this.avatarData = file[0];
  }

  uploadAvatar() {
    this.authService
      .uploadAvatar(this.avatarData, 'avatar')
      .subscribe((data: any) => {
        console.log('>>> data: ', data);
        this.avatarFileName = data.data.originalname;
        this.avatarPath = `${environment.apiBackend}/images/${this.avatarFileName}`
      });
  }
}
