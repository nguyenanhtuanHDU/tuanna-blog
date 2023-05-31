import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../models/user.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderComponent } from '../header/header.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { SweetAlertService } from '../services/sweet-alert.service';
import { format } from 'date-fns';
import { Chart, registerables } from 'chart.js';
import { global } from "../shared/global";
import { PostService } from "../services/post.service";
import { Subject, takeUntil, timer } from "rxjs";
Chart.register(...registerables);

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @ViewChild(HeaderComponent, { static: true }) header: HeaderComponent;
  @ViewChild('userInfolgModal', { static: true }) userInfolgModal: any;
  @ViewChild('inputUsername', { static: true }) inputUsername: ElementRef;
  user: User
  userSession: User
  avatarData: any;
  imagePath = global.imagePath
  avatarSelected: string;
  imageItem: string;
  maxDate: Date;
  listTags = global.listTags
  countPostEachTag: any
  defaultImage = global.defaultImage
  chart: any
  unsub = new Subject<void>();

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
    private postService: PostService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private sweetAlert: SweetAlertService,
    private route: ActivatedRoute,
  ) {
    this.reloadUserInfo();
    this.maxDate = new Date();
  }

  trackByFn(index: number, item: any) {
    return item.id; // hoặc bất kỳ giá trị unique nào khác của phần tử
  }

  getUserSession() {
    this.userService.getUserInfo().pipe(takeUntil(this.unsub)).subscribe((data: any) => {
      this.userSession = data.data
      console.log(`🚀 ~ this.userSession:`, this.userSession)
    })
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
    // timer(500).subscribe(() => {
    //   this.inputUsername.nativeElement.focus();
    // })
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
      this.user = data.data;
      this.spinner.hide();
    });
  }

  getUserByID(id: string) {
    this.spinner.show();
    this.userService.getUserByID(id).pipe(takeUntil(this.unsub)).subscribe((data: any) => {
      this.user = data.data;
      this.spinner.hide();
    }, (err: any) => {
      console.log(`🚀 ~ err:`, err)
      this.router.navigate(['**'])
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
    // console.log(`🚀 ~ data.birthday:`, data.birthday)
    // data.birthday = format(new Date(data.birthday), 'dd/MM/yyyy')
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

  createChartPosts(data: any) {
    if (this.chart) {
      this.chart.destroy()
      console.log('co chart');
    }
    this.chart = new Chart("myChart", {
      type: 'bar',
      data: {
        labels: this.listTags,
        datasets: [{
          label: 'number of Posts',
          data: [data?.Asia,
          data?.Europe,
          data?.Africa,
          data?.America,
          data?.Oceania,
          data?.Antarctica],
          backgroundColor: [
            'rgba(238, 230, 87, 0.3)',
            'rgba(46, 204, 113, 0.3)',
            'rgba(52, 152, 219, 0.3)',
            'rgba(155, 89, 182, 0.3)',
            'rgba(52, 73, 94, 0.3)',
            'rgba(252, 96, 66, 0.3)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1,
          borderRadius: 6,
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        },
      }
    });
  }

  getPostCountEachTagByUserID(id: string) {
    this.postService.getAllPosts(undefined, undefined, id).pipe(takeUntil(this.unsub)).subscribe((data: any) => {
      this.createChartPosts(data)
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id']
      console.log(`🚀 ~ id:`, id)
      this.getUserByID(id)
      this.getPostCountEachTagByUserID(id)
    });
    this.getUserSession()
  }

  ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
  }
}
