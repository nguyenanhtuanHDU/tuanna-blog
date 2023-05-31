import { Component } from '@angular/core';
import { Post } from "src/app/models/post.model";
import { PostService } from "src/app/services/post.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: 'app-manage-post',
  templateUrl: './manage-post.component.html',
  styleUrls: ['./manage-post.component.scss']
})
export class ManagePostComponent {
  listPosts: Post[] = []

  constructor(private postService: PostService) {

  }

  ngOnInit(): void {
    this.getAllPostsNonPaging()
  }

  getAllPostsNonPaging() {
    this.postService.getAllPostsNonPaging().subscribe((data: any) => {
      this.listPosts = data.data
      console.log(`🚀 ~ data.data:`, data.data)
    })
  }

  reloadPostsNonPaging(event: boolean) {
    event && this.getAllPostsNonPaging()
  }
}
