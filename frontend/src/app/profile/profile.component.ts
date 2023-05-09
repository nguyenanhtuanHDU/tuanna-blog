import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../models/user.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderComponent } from '../header/header.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { SweetAlertService } from '../services/sweet-alert.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @ViewChild(HeaderComponent, { static: false })
  header!: HeaderComponent;
  @ViewChild('userInfolgModal') userInfolgModal: any;
  @ViewChild('inputUsername', { static: false }) inputUsername: ElementRef;
  user: User
  avatarData: any;
  listBgAvatarsDefault: string[];
  srcImagesParent = `${environment.apiBackend}/images/avatars/`;
  srcBgsParent = `${environment.apiBackend}/images/bg-avatars/`;
  srcImage: string;
  srcBg: string;
  listAvatarsDefault: string[];
  avatarSelected: string;
  imageItem: string;
  maxDate: Date;

  editUserForm = new FormGroup({
    username: new FormControl('', Validators.minLength(6)),
    email: new FormControl('', [
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    birthday: new FormControl(),
    address: new FormControl(''),
    gender: new FormControl(''),
  });

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private sweetAlert: SweetAlertService
  ) {
    this.reloadUserInfo();
    this.maxDate = new Date();
  }

  getListAvatarDefault(typeImage: string) {
    this.spinner.show();
    if (typeImage === 'avatar') {
      this.listAvatarsDefault = this.user.listAvatarsDefault;
    } else if (typeImage === 'bg') {
      this.listBgAvatarsDefault = this.user.listBgAvatarsDefault;
    }
    this.spinner.hide();
  }

  deleteAvatar(avatar: string) {
    this.sweetAlert.yesNo('Do you want to delete this image?', () => {
      this.spinner.show();
      this.userService.deleteAvatar(this.user._id, avatar).subscribe(
        (data: any) => {
          this.spinner.hide();
          Swal.fire(data.msg, '', 'success');
          this.reloadUserInfo();
        },
        (error) => {
          console.log(error);
          this.spinner.hide();
          Swal.fire(error.error.msg, 'Failed', 'error');
        }
      );
    });
  }

  deleteBg(bgAvatar: string) {
    this.sweetAlert.yesNo('Do you want to delete this image ?', () => {
      this.spinner.show();
      this.userService.deleteBgAvatar(this.user._id, bgAvatar).subscribe(
        (data: any) => {
          console.log(data);
          this.spinner.hide();
          Swal.fire(data.msg, '', 'success');
          this.reloadUserInfo();
        },
        (error) => {
          console.log(error);
          this.spinner.hide();
          Swal.fire(error.error.msg, 'Failed', 'error');
        }
      );
    });
  }

  getUserInfoToEdit() {
    this.editUserForm.get('username')?.setValue(this.user.username);
    this.editUserForm.get('email')?.setValue(this.user.email);
    this.editUserForm.get('firstName')?.setValue(this.user.fullName.firstName);
    this.editUserForm.get('lastName')?.setValue(this.user.fullName.lastName);
    this.editUserForm.get('birthday')?.setValue(this.user.birthday);
    this.editUserForm.get('address')?.setValue(this.user.address);
    this.editUserForm.get('gender')?.setValue(this.user.gender);

    setTimeout(() => {
      this.inputUsername.nativeElement.focus();
    }, 500);
  }

  updateAvatar(avatar: string) {
    this.sweetAlert.yesNo(
      'Do you want to update avatar by this image ?',
      () => {
        this.spinner.show();
        this.userService.updateAvatar(this.user._id, avatar).subscribe(
          (data: any) => {
            this.spinner.hide();
            Swal.fire(data.msg, '', 'success');
            this.reloadUserInfo();
          },
          (error) => {
            this.spinner.hide();
            console.log(error);
            Swal.fire(error.error.msg, 'Failed', 'error');
          }
        );
      }
    );
  }

  updateBg(avatar: string) {
    this.sweetAlert.yesNo(
      'Do you want to update background by this image?',
      () => {
        this.spinner.show();
        this.userService.updateBgAvatar(this.user._id, avatar).subscribe(
          (data: any) => {
            this.spinner.hide();
            Swal.fire(data.msg, '', 'success');
            this.reloadUserInfo();
          },
          (error) => {
            this.spinner.hide();
            console.log(error);
            Swal.fire(error.error.msg, 'Failed', 'error');
          }
        );
      }
    );
  }

  reloadUserInfo() {
    this.spinner.show();
    this.header?.getUserInfo();
    this.userService.getUserInfo().subscribe((data: any) => {
      console.log('🚀 ~ data:', data);
      this.user = data.data;
      console.log("👉👉👉 ~ data.data:", data.data)
      this.srcImage = `${this.srcImagesParent}${data.data.avatar}`;
      this.srcBg = `${this.srcBgsParent}${data.data.bgAvatar}`;
      this.spinner.hide();
    });
  }

  updateUser() {
    const { username, address, email, firstName, lastName, birthday, gender } = this.editUserForm.value;

    const data = { ...this.editUserForm.value, fullName: {} };
    const fullName = {
      firstName: data.firstName,
      lastName: data.lastName
    }
    data.fullName = fullName
    data.birthday = format(new Date(data.birthday), 'dd/MM/yyyy')
    delete data.firstName
    delete data.lastName

    if (username && address && email && firstName && lastName && birthday && gender && username.length >= 6) {
      this.spinner.show();
      this.userService.updateAUser(data).subscribe(
        (data: any) => {
          this.spinner.hide();
          this.userInfolgModal.hide();
          this.reloadUserInfo();
          Swal.fire(data.msg, 'Success', 'success');
        },
        (error) => {
          this.spinner.hide();
          Swal.fire(error.error.msg, 'Failed', 'error');
          console.log(error);
        }
      );
    } else if (username!.length < 6) {
      Swal.fire('Username must have at least 6 characters', '', 'warning');
    }
    else {
      Swal.fire('Please fill out the information completely', '', 'warning');
    }
  }

  chooseImage(file: FileList) {
    console.log(file);
    this.avatarSelected = `${file.length} files was choosen`;
    this.avatarData = file;
  }

  uploadAvatar() {
    this.sweetAlert.yesNo('Do you want to upload this image ?', () => {
      this.spinner.show();
      this.userService.uploadAvatar(this.avatarData).subscribe(
        (data: any) => {
          this.spinner.hide();
          Swal.fire(data.msg, 'Success', 'success');
          this.reloadUserInfo();
          this.avatarSelected = '';
          this.avatarData = '';
        },
        (error) => {
          this.spinner.hide();
          console.log(error);
          Swal.fire(error.error.msg, 'Failed', 'error');
        }
      );
    });
  }

  uploadBg() {
    this.sweetAlert.yesNo('Do you want to upload this image ?', () => {
      this.spinner.show();
      this.userService.uploadBg(this.avatarData).subscribe(
        (data: any) => {
          this.spinner.hide();
          Swal.fire(data.msg, 'Success', 'success');
          this.reloadUserInfo();
          this.avatarSelected = '';
          this.avatarData = '';
        },
        (error) => {
          this.spinner.hide();
          console.log(error);
          Swal.fire(error.error.msg, 'Failed', 'error');
        }
      );
    });
  }

  validateUsername() {
    if (this.editUserForm.get('username')?.hasError('minlength')) {
      return 'Username must be contains 6 characters';
    } else {
      return '';
    }
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
