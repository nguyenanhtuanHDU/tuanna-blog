import { Component, ViewChild } from '@angular/core';
import { UserService } from "../services/user.service";
import { User } from "../models/user.model";
import { global } from "../shared/global";
import { HeaderComponent } from "../header/header.component";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  @ViewChild(HeaderComponent, { static: true }) headerComp: HeaderComponent

  listAdmin: User[] = []
  imagePath: string = global.imagePath

  constructor(private userService: UserService, private spinner: NgxSpinnerService) {

  }

  ngOnInit(): void {
    this.spinner.show();
    this.userService.getListAdmin().subscribe((data: any) => {
      this.spinner.hide();
      this.listAdmin = data.data
    }, (err) => {
      this.spinner.hide()
      console.log(`🚀 ~ err:`, err)
      Swal.fire(err.error.msg, '', 'error')
    })
  }
}
