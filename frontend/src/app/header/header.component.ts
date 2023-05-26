import { Component, EventEmitter, Injectable, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
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
import { NotificationService } from "../services/notification.service";
import { Post } from "../models/post.model";
import { PostService } from "../services/post.service";
import { Subject, debounceTime, distinctUntilChanged } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
// @Injectable({
//   providedIn: 'root',
// })
export class HeaderComponent implements OnInit {
  @Output() getTag = new EventEmitter<string>();
  @Output() getAllPosts = new EventEmitter<boolean>();
  @Output() passPostID = new EventEmitter<string>();

  private searchTerm = new Subject<string>();
  user: User
  listNotices: Notice[] = []
  avatarSrc: string = `${environment.apiBackend}/images/avatars/`;
  faBars = faBars;
  faRightFromBracket = faRightFromBracket;
  imagePath = environment.apiBackend + '/images/'
  noticeCount: number = 0
  listTags = ['Asia', 'Europe', 'Africa', 'America', 'Oceania', 'Antarctica']
  postsByTitle: Post[] = []
  searchPostsSubject = new Subject<string>();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private socket: Socket,
    private noticeService: NoticeService,
    private notificationService: NotificationService,
    private postService: PostService,
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

  passTag(tag: string): void {
    this.getTag.next(tag);
  }

  callGetAllPost() {
    this.getAllPosts.next(true);
  }

  onPassPostID(postID: string) {
    this.passPostID.next(postID)
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

  searchListPosts(dropdown: any, event: any) {
    const titleSearch: string = event.target.value
    this.searchPostsSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((titleSearch: string) => {
      console.log(`🚀 ~ titleSearch:`, titleSearch)
      titleSearch ? dropdown.show() : dropdown.hide(); this.postsByTitle = [];
      this.postService.getPostsByTitle(titleSearch).subscribe((data: any) => {
        this.postsByTitle = data.data;
        console.log(`🚀 ~ data.data:`, data.data);
        this.postsByTitle.map((item: any) => {
          item.title = item.title.replaceAll(new RegExp(titleSearch, "gi"), "<b class='text-primary'>$&</b>");
        });
      });
    });
    this.searchPostsSubject.next(titleSearch);
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

  resetReadNotice(id: string, type: string, noticeID: string) {
    this.noticeService.resetNotices(id, type, noticeID).subscribe((data: any) => {
      this.getUserInfo();
      this.getNoticesByID(this.user._id)
    })
  }

  getSinglePost(id: string, type: string, noticeID: string) {
    this.router.navigate(['post', id]);
    this.onPassPostID(id)
    this.resetReadNotice(id, type, noticeID)
    this.getNoticesByID(this.user._id)
  }

  ngOnInit() {
    this.getUserInfo();
  }
}
