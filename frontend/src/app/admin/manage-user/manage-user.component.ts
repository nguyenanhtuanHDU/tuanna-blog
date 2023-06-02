import { Component, ViewChild } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { HeaderComponent } from "src/app/header/header.component";
import { User } from "src/app/models/user.model";
import { UserService } from "src/app/services/user.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent {
  @ViewChild(HeaderComponent) headerComp: HeaderComponent;

  listUser: User[] = []

  constructor(private userService: UserService, private spinner: NgxSpinnerService) {

  }

  ngOnInit(): void {
    this.getNonAdminUsers()
    console.log(this.headerComp);
  }

  getNonAdminUsers() {
    this.spinner.show();
    this.userService.getNonAdminUsers().subscribe((data: any) => {
      this.spinner.hide();
      this.listUser = data.data
    }, (err) => {
      this.spinner.hide()
      console.log(`🚀 ~ err:`, err)
      Swal.fire(err.error.msg, '', 'error')
    })
  }

  reloadNonAdminUsers(event: boolean) {
    console.log(`🚀 ~ event:`, event)
    event && this.getNonAdminUsers()
  }
}
