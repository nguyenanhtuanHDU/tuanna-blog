import { Component, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

@Injectable({
  providedIn: 'root',
})

export class HeaderComponent implements OnInit{
  username: string;
  email: string;
  avatar: string;

  faBars = faBars;
  faRightFromBracket = faRightFromBracket;
  constructor(private authService: AuthService) {}

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
        Swal.fire(
          'Log out success !',
          'Your account just logged out !',
          'success'
        );
      }
    });
  }

  getUserInfo() {
    this.authService.getUserByToken().subscribe(
      (data: any) => {
        console.log(data);
        this.username = data.username;
        this.email = data.email;
        this.avatar = `${environment.apiBackend}/images/avatars/${data.avatar}`;
      },
      (err) => {
        console.log(err);
      }
    );
  }

   // eslint-disable-next-line @angular-eslint/contextual-lifecycle
   ngOnInit() {
    this.getUserInfo();
  }
}
