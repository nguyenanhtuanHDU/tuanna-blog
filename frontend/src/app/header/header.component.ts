import { Component, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  username: string;
  email: string;

  faBars = faBars;
  faRightFromBracket = faRightFromBracket;
  constructor(private authService: AuthService) {}

  logOut() {
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
    const token = this.authService.getToken();
    console.log('>>> token: ', token);

    this.authService.getUserByToken().subscribe(
      (data: any) => {
        console.log(data);
        this.username = data.username;
        this.email = data.email;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  ngOnInit(){
    this.getUserInfo()
  }
}
