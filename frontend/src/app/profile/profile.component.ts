import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from '../models/user.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  @ViewChild('HeaderComponent', { static: false })
  header: HeaderComponent;
  user: User;
  avatarData: any;
  avatarPath: string;

  uploadAvatarForm = new FormGroup({
    avatarForm: new FormControl(''),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  reloadUserInfo() {
    this.authService.getUserByToken().subscribe((data: any) => {
      console.log('>>> data pro: ', data);
      this.user = {
        id: data.id,
        username: data.username,
        email: data.email,
        address: data.address,
      };
      this.avatarPath = `${environment.apiBackend}/images/avatars/${data.avatar}`;
    });
    console.log('>>> user: ', this.user);
  }

  chooseFile(file: FileList) {
    console.log('>>> files: ', file);
    this.avatarData = file[0];
  }

  uploadAvatar() {
    this.spinner.show();
    this.authService.uploadAvatar(this.avatarData, 'avatar').subscribe(
      (data: any) => {
        this.spinner.hide();
        this.uploadAvatarForm.get('avatarForm')?.setValue('');
        Swal.fire('Upload avatar success', data.msg, 'success');
        this.reloadUserInfo();
      },
      (err) => {
        console.log(err);
        Swal.fire('Upload avatar success', err.msg, 'error');
      }
    );
  }

  ngOnInit(): void {
    this.reloadUserInfo();
    if (!this.authService.checkToken()) {
      this.router.navigate(['/login']);
    }
  }

  ngDoCheck(): void {
    if (!this.authService.checkToken()) {
      this.router.navigate(['/login']);
    }
  }

  ngAfterViewInit(): void {
    console.log('>>> header: ', HeaderComponent);
  }
}
