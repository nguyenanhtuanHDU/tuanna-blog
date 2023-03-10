import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  faBars = faBars;
  faRightFromBracket = faRightFromBracket;
  constructor(private authService: AuthService) {}

  // ngOnInit(): void {
  //   // const user =  this.authService.getUserByID()
  // }

  logOut() {
    this.authService.logOut();
  }
}
