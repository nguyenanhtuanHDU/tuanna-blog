import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from "src/app/models/user.model";
import { global } from "../global";
import { Post } from "src/app/models/post.model";
import { UserService } from "src/app/services/user.service";
import Swal from 'sweetalert2';
import { PostService } from "src/app/services/post.service";
import { SweetAlertService } from "src/app/services/sweet-alert.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { format } from "date-fns";

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent {
  @Input() listData: User[] | Post[] | any[] = []
  @Input() type: string = 'admin'
  @Input() headerComp: any
  @Output() reloadListData = new EventEmitter<boolean>();

  formEditUser = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(6)]),
    birthday: new FormControl('', [Validators.required, Validators.minLength(6)]),
    gender: new FormControl(),
  })

  userSession: User
  imagePath: string = global.imagePath
  headTableContent: string[] = []
  listUsersContent: string[] = ['Avatar', 'Username', 'Views', 'Birthday', 'Gender', 'Role', 'Join At']
  listPostsContent: string[] = ['Title', 'Tag', 'Likers', 'Comments', 'Author', 'Created At']

  constructor(private userService: UserService, private postService: PostService, private SweetAlertService: SweetAlertService) {

  }

  ngOnInit(): void {
    this.getUserSession()
    this.headTableContent = (this.type === 'admin' || this.type === 'user') ? this.listUsersContent : this.listPostsContent;
  }

  getUserSession() {
    this.userService.getUserInfo().subscribe((data: any) => {
      this.userSession = data.data
    })
  }

  deleteUserByID(id: string) {
    this.SweetAlertService.yesNo('Do you want to delete this user ?', () => {
      this.userService.deleteUserByID(id).subscribe((data: any) => {
        this.reloadListData.next(true)
        Swal.fire(
          data.msg,
          '',
          'success'
        );
      }, (err) => {
        console.log(err);
        Swal.fire(
          err.msg,
          '',
          'error'
        );
      })
    })
  }

  deletePostByID(id: string) {
    this.SweetAlertService.yesNo('Do you want to delete this post ?', () => {
      this.postService.deletePostByID(id).subscribe((data: any) => {
        this.reloadListData.next(true)
        Swal.fire(
          data.msg,
          '',
          'success'
        );
      }, (err) => {
        console.log(err);
        Swal.fire(
          err.msg,
          '',
          'error'
        );
      })
    })
  }

  openModalEditUser(modal: any, user: User) {
    console.log(`🚀 ~ user:`, user)
    this.formEditUser.get('username')?.setValue(user.username)
    this.formEditUser.get('birthday')?.setValue(user.birthday)
    this.formEditUser.get('gender')?.setValue(user.gender)
    modal.show()
  }

  updateUser(userID: string) {
    const data: any = this.formEditUser.value
    data.birthday = format(new Date(data.birthday), 'dd/MM/yyyy')
    console.log(`🚀 ~ data.birthday:`, data.birthday)

    this.userService.updateAUserByAdmin(userID, data).subscribe((data: any) => {
      console.log(`🚀 ~ data:`, data)
      this.reloadListData.next(true)
      Swal.fire(data.msg, '', 'success')
    }, (err) => {
      console.log(`🚀 ~ err:`, err)
      Swal.fire(err.error.msg, '', 'error')
    })
  }
}
