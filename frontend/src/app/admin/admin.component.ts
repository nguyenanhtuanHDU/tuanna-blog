import { Component, ViewChild } from '@angular/core';
import { UserService } from "../services/user.service";
import { User } from "../models/user.model";
import { global } from "../shared/global";
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  @ViewChild(HeaderComponent, { static: true }) headerComp: HeaderComponent

  listAdmin: User[] = []
  imagePath: string = global.imagePath

  constructor(private userService: UserService) {

  }

  ngOnInit(): void {
    this.userService.getListAdmin().subscribe((data: any) => {
      this.listAdmin = data.data
    })
  }
}
