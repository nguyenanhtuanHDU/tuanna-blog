import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from "src/app/header/header.component";
import { User } from "src/app/models/user.model";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent {
  @ViewChild(HeaderComponent) headerComp: HeaderComponent;

  listUser: User[] = []

  constructor(private userService: UserService) {

  }


  ngOnInit(): void {
    this.getNonAdminUsers()
    console.log(this.headerComp);

  }

  getNonAdminUsers() {
    this.userService.getNonAdminUsers().subscribe((data: any) => {
      this.listUser = data.data
    })
  }

  reloadNonAdminUsers(event: boolean) {
    console.log(`🚀 ~ event:`, event)
    event && this.getNonAdminUsers()
  }
}