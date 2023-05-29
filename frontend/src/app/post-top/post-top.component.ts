import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Post } from "../models/post.model";
import { environment } from "src/environments/environment";
import { ActivatedRoute, Router } from "@angular/router";
import { PostService } from "../services/post.service";
import { global } from "../shared/global";

@Component({
  selector: 'app-post-top',
  templateUrl: './post-top.component.html',
  styleUrls: ['./post-top.component.scss'],
})
export class PostTopComponent {
  @Input() postsTop: Post[]
  @Input() icon: string
  @Input() type: string
  @Output() changeViews = new EventEmitter<boolean>();
  @Output() passPostID = new EventEmitter<string>();

  idPost: string
  isChangeViews: boolean = false

  imagePath = global.imagePath
  constructor(private router: Router, private postService: PostService, route: ActivatedRoute) {
    const id = route.snapshot.paramMap.get('id');
    if (id !== null && id !== undefined) {
      this.idPost = id;
    }
  }

  onChangeViews() {
    this.isChangeViews = false
    this.changeViews.emit(this.isChangeViews);
    this.isChangeViews = true
  }

  trackByFn(index: number, item: any) {
    return item.id;
  }

  updatePostViewers(id: string) {
    console.log('>>> run post top');
    this.passPostID.emit(id);
    this.onChangeViews()
    this.idPost !== id && this.postService.updatePostViews(id).subscribe((data: any) => {
      console.log("🚀 ~ data:", data)
    })
  }

  // ngOnInit(): void {
  //   console.log(`🚀 ~ this.type:`, this.type)
  // }
}

