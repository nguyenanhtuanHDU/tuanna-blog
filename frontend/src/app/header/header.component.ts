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
  avatarSrc: string = `${environment.apiBackend}/images/avatars/`;
  faBars = faBars;
  faRightFromBracket = faRightFromBracket;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

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
        console.log(this.avatarSrc + this.user.avatar);
      },
      (err) => {
        this.spinner.hide();
        console.log('err :', err);
      }
    );
  }

  ngOnInit() {
    this.getUserInfo();
  }
}
