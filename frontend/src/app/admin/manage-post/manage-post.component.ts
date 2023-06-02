import { Component } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { Post } from "src/app/models/post.model";
import { PostService } from "src/app/services/post.service";
import { UserService } from "src/app/services/user.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-manage-post',
  templateUrl: './manage-post.component.html',
  styleUrls: ['./manage-post.component.scss']
})
export class ManagePostComponent {
  listPosts: Post[] = []

  constructor(private postService: PostService, private spinner: NgxSpinnerService) {

  }

  ngOnInit(): void {
    this.getAllPostsNonPaging()
  }

  getAllPostsNonPaging() {
    this.spinner.show();
    this.postService.getAllPostsNonPaging().subscribe((data: any) => {
      this.spinner.hide();
      this.listPosts = data.data
      console.log(`🚀 ~ data.data:`, data.data)
    }, (err) => {
      this.spinner.hide()
      console.log(`🚀 ~ err:`, err)
      Swal.fire(err.error.msg, '', 'error')
    })
  }

  reloadPostsNonPaging(event: boolean) {
    event && this.getAllPostsNonPaging()
  }
}
