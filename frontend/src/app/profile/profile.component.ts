import { Component, OnInit, ViewChild } from '@angular/core';
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
export class ProfileComponent implements OnInit {
  @ViewChild(HeaderComponent, { static: false })
  header!: HeaderComponent;
  user: User;
  avatarData: any;
  avatarPath: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  reloadUserInfo() {
    this.spinner.show();
    this.authService.getUserByToken().subscribe((data: any) => {
      this.user = {
        id: data.id,
        username: data.username,
        email: data.email,
        address: data.address,
      };
      this.avatarPath = `${environment.apiBackend}/images/avatars/${data.avatar}`;
    });
    this.spinner.hide();
    console.log('>>> user: ', this.user);
  }

  chooseFile(file: FileList) {
    console.log('>>> files: ', file);
    this.avatarData = file[0];
  }

  uploadAvatar() {
    Swal.fire({
      title: 'Do you want to upload this image?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Upload',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.authService.uploadAvatar(this.avatarData, 'avatar').subscribe(
          (data: any) => {
            this.spinner.hide();
            Swal.fire(data.msg, 'Success', 'success');
            this.reloadUserInfo();
            this.header.getUserInfo();
          },
          (error) => {
            this.spinner.hide();
            console.log(error);
            Swal.fire(error.error.msg, 'Failed', 'error');
          }
        );
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
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
}
