import { Component, Input, SimpleChanges } from '@angular/core';
import { formatDistanceToNow } from "date-fns";
import { Slick } from "ngx-slickjs";
import { environment } from "src/environments/environment";
import { User } from "../models/user.model";
import { UserService } from "../services/user.service";
import { PostService } from "../services/post.service";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { Post } from "../models/post.model";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {
  imagePath = environment.apiBackend + '/images/'
  userSession: User
  post: Post
  postsViewers: Post[]
  postsLikers: Post[]
  getPostByIDSub: Subscription

  constructor(private userService: UserService, private route: ActivatedRoute, private postService: PostService, private router: Router) {

  }

  config: Slick.Config = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    mouseWheelMove: false
    // accessibility: true
  };

  formatTimeAgo(time: any) {
    return formatDistanceToNow(new Date(time), { addSuffix: true, includeSeconds: true });
  }

  getPostByID() {
    const id = this.route.snapshot.paramMap.get('id')
    this.getPostByIDSub = this.postService.getPostByID(String(id)).subscribe((data: any) => {
      this.post = data.data
    })
  }

  getTopPostsViewers(top: number) {
    this.postService.getTopViewer(top).subscribe((data: any) => {
      this.postsViewers = data.data
    })
  }

  getTopPostsLikes(top: number) {
    this.postService.getTopLikes(top).subscribe((data: any) => {
      this.postsLikers = data.data
      console.log("🚀 ~ this.postsLikers:", this.postsLikers)
    })
  }

  getUserSessionInfo() {
    this.userService.getUserInfo().subscribe((data: any) => {
      this.userSession = data.data
    })
  }

  updateStatusLike(event: any, idPost: string) {
    this.userService.updateLikes({
      like: event.target.checked,
      idPost
    }).subscribe((data: any) => {
      this.getUserSessionInfo()
      this.getPostByID()
    })
  }

  ngOnInit(): void {
    this.getPostByID()
    this.getUserSessionInfo()
    this.getTopPostsViewers(5)
    this.getTopPostsLikes(5)
    this.route.paramMap.subscribe(params => {
      this.router.navigate(['/', params.get('id')])
      this.getPostByID()
    });
  }

  ngOnDestroy(): void {
    this.getPostByIDSub.unsubscribe()
  }
}
