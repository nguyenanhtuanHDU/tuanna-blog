import { Component, Injectable, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from "../models/user.model";
import { Router } from "@angular/router";
import { Socket } from "ngx-socket-io";
import { NoticeService } from "../services/notice.service";
import { Notice } from "../models/notice.model";
import { formatDistanceToNow } from "date-fns";
import { NotificationService } from "../services/notification.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
// @Injectable({
//   providedIn: 'root',
// })
export class HeaderComponent implements OnInit {
  user: User
  listNotices: Notice[] = []
  avatarSrc: string = `${environment.apiBackend}/images/avatars/`;
  faBars = faBars;
  faRightFromBracket = faRightFromBracket;
  imagePath = environment.apiBackend + '/images/'
  noticeCount: number = 0
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private socket: Socket,
    private noticeService: NoticeService,
    private notificationService: NotificationService,
  ) {
    this.socket.on('notice', (data: any) => {
      console.log('Dữ liệu từ máy chủ:', data);
      // this.listNotices.push(data)
      // this.getUserInfo()
      // this.noticeService.getNoticesByUserID(this.user._id).subscribe((data: any) => {
      //   console.log(`🚀 ~ data:`, data)
      //   this.listNotices = data
      // })
    });
  }

  public logOut() {
    Swal.fire({
      title: 'Are you sure to log out ?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes !',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logOut();
        this.router.navigate(['/login'])
        Swal.fire(
          'Log out success !',
          'Your account just logged out !',
          'success'
        );
      }
    });
  }

  getUserInfo() {
    this.spinner.show();
    this.userService.getUserInfo().subscribe(
      (data: any) => {
        this.spinner.hide();
        this.user = data.data;
        this.getNoticesByID(this.user._id)
      },
      (err) => {
        this.spinner.hide();
        console.log('err :', err);
      }
    );
  }

  getNoticesByID(id: string) {
    this.noticeService.getNoticesByUserID(id).subscribe((data: any) => {
      this.listNotices = data.data
      this.noticeCount = this.listNotices.filter((item: any) => !item.isRead).length
      this.noticeCount >= 1 && this.notificationService.notice()
    })
  }

  resetReadNotice(id: string, type: string, userID: string = '', postID: string = '') {
    this.noticeService.resetNotices(id, type, userID, postID).subscribe((data: any) => {
      this.getUserInfo();
      this.getNoticesByID(this.user._id)
    })
  }

  changeId(id: string, type: string, userID: string, postID: string) {
    this.router.navigate(['/post', id]);
    // this.noticeService.resetNotices(id, type, userID, postID).subscribe((data: any) => {
    //   this.getUserInfo();
    // })
    this.resetReadNotice(id, type, userID, postID)
    this.getNoticesByID(this.user._id)
  }

  formatTimeAgo(time: any) {
    return formatDistanceToNow(new Date(time), { addSuffix: true, includeSeconds: true });
  }

  ngOnInit() {
    this.getUserInfo();
  }
}
