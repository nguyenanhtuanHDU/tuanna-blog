import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService,private router: Router) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    console.log('>>> home token: ', token["email"], token["password"]);
    if(token["email"] === "" || token["password"] === ""){
      this.router.navigate(['/login'])
    }
  }
}
