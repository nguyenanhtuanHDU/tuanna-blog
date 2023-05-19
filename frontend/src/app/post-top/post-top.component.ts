import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Post } from "../models/post.model";
import { environment } from "src/environments/environment";
import { ActivatedRoute, Router } from "@angular/router";
import { PostService } from "../services/post.service";

@Component({
  selector: 'app-post-top',
  templateUrl: './post-top.component.html',
  styleUrls: ['./post-top.component.scss'],
})
export class PostTopComponent {
  @Input() heading: string
  @Input() postsTop: Post[]
  @Input() icon: string
  @Input() type: string
  @Output() getNewPost = new EventEmitter();

  idPost: string

  imagePath = environment.apiBackend + '/images/'
  constructor(private router: Router, private postService: PostService, route: ActivatedRoute) {
    const id = route.snapshot.paramMap.get('id');
    if (id !== null && id !== undefined) {
      this.idPost = id;
    }
  }

  trackByFn(index: number, item: any) {
    return item.id;
  }

  updatePostViewers(id: string) {
    if (this.idPost !== id) {
      this.idPost !== id && this.postService.updatePostViews(id).subscribe((data: any) => {
        console.log("🚀 ~ data:", data)
      })
    }
  }

  ngOnInit(): void {
    console.log(`🚀 ~ this.type:`, this.type)
  }
}

