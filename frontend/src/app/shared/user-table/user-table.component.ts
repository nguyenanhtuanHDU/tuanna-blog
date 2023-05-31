import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from "src/app/models/user.model";
import { global } from "../global";
import { Post } from "src/app/models/post.model";
import { UserService } from "src/app/services/user.service";
import Swal from 'sweetalert2';
import { PostService } from "src/app/services/post.service";
import { SweetAlertService } from "src/app/services/sweet-alert.service";

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent {
  @Input() listData: User[] | Post[] | any[] = []
  @Input() type: string = 'admin'
  @Output() reloadListData = new EventEmitter<boolean>();

  imagePath: string = global.imagePath
  headTableContent: string[] = []
  listUsersContent: string[] = ['Avatar', 'Username', 'Birthday', 'Gender', 'Role', 'Join At']
  listPostsContent: string[] = ['Title', 'Tag', 'Views', 'Likers', 'Comments', 'Author', 'Created At']

  constructor(private userService: UserService, private postService: PostService, private SweetAlertService: SweetAlertService) {

  }

  ngOnInit(): void {
    this.headTableContent = (this.type === 'admin' || this.type === 'user') ? this.listUsersContent : this.listPostsContent;
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
}
