import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from "../models/post.model";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { PostService } from "../services/post.service";

@Component({
  selector: 'app-post-top',
  templateUrl: './post-top.component.html',
  styleUrls: ['./post-top.component.scss']
})
export class PostTopComponent {
  @Input() heading: string
  @Input() postsTop: Post[]
  @Input() icon: string
  @Input() type: string
  @Output() getNewPost = new EventEmitter();

  imagePath = environment.apiBackend + '/images/'
  constructor(private router: Router, private postService: PostService) {

  }

  trackByFn(index: number, item: any) {
    return item.id;
  }

  updatePostViewers(id: string) {
    this.postService.updatePostViews(id).subscribe((data: any) => {
      console.log("🚀 ~ data:", data)
    })
  }
}

