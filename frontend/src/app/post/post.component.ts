import { Component, ElementRef, Input, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { Slick } from "ngx-slickjs";
import { environment } from "src/environments/environment";
import { User } from "../models/user.model";
import { UserService } from "../services/user.service";
import { PostService } from "../services/post.service";
import { ActivatedRoute, NavigationEnd, NavigationStart, Route, Router } from "@angular/router";
import { Post } from "../models/post.model";
import { Subscription, of, switchMap, timer } from "rxjs";
import { FormControl, FormGroup } from "@angular/forms";
import { BsModalRef, BsModalService, ModalDirective } from "ngx-bootstrap/modal";
import { SweetAlertService } from "../services/sweet-alert.service";
import { CommentService } from "../services/comment.service";
import Swal from 'sweetalert2';
import { NgScrollbar } from "ngx-scrollbar";
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from "../services/notification.service";
import { global } from "../shared/global";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {
  @ViewChild('commentScrollbar', { static: true }) commentScrollbar: NgScrollbar;
  @ViewChild('createPostModal', { static: true }) createPostModal: ModalDirective;
  @ViewChild('inputComment', { static: true }) inputComment: ElementRef;

  formEditComment = new FormGroup({
    content: new FormControl(),
  });

  formCreateComment = new FormGroup({
    content: new FormControl(),
  });

  formEditPost = new FormGroup({
    title: new FormControl(),
    content: new FormControl(),
    tag: new FormControl(),
    images: new FormControl(),
  });

  imagePath = global.imagePath
  userSession: User
  post: Post
  postsViewers: Post[]
  postsLikers: Post[]
  getPostByIDSub: Subscription
  modalCreateCommentRef?: BsModalRef;
  imagesSelected: string[] = []
  newImagesSelected: string[] = []
  selectedFiles: any
  postEditID: string
  topPost: number = 3

  constructor(private userService: UserService, private route: ActivatedRoute, private postService: PostService, private router: Router, private bsModalService: BsModalService, private sweetAlert: SweetAlertService, private commentService: CommentService, private spinner: NgxSpinnerService, private notification: NotificationService) {
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     console.warn('change path');
    //     this.getPostByID()
    //   }
    // });
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

  getPostByID() {
    const id = this.route.snapshot.paramMap.get('id')
    console.log(`🚀 ~ id:`, id)
    if (id) {
      this.postEditID = id
      this.postService.getPostByID(id).subscribe((data: any) => {
        console.log('>>> get post moi');
        this.post = data.data
        this.imagesSelected = data.data.images
      })
    }
  }

  reloadPostByNotice(postID: string) {
    this.router.navigate(['/post', postID])
    this.getPostByID()
  }

  getTopPostsViewers(top: number) {
    this.postService.getTopViewer(top).subscribe((data: any) => {
      this.postsViewers = data.data
    })
  }

  getTopPostsLikes(top: number) {
    this.postService.getTopLikes(top).subscribe((data: any) => {
      this.postsLikers = data.data
    })
  }

  getUserSessionInfo() {
    this.userService.getUserInfo().subscribe((data: any) => {
      this.userSession = data.data
    })
  }

  updateStatusLike(event: any, idPost: string) {
    this.notification.like()
    this.userService.updateLikes({
      like: event.target.checked,
      idPost
    }).subscribe((data: any) => {
      this.getTopPostsLikes(3)
      this.getUserSessionInfo()
      this.getPostByID()
    })
  }

  createComment(postID: string) {
    const content = this.formCreateComment.get('content')?.value
    if (content) {
      this.notification.comment()
      this.commentService.createPost({ type: 'CREATE_COMMENT', postID: postID, content }).subscribe((data) => {
        this.getPostByID()
        this.formCreateComment.reset()

        if (this.commentScrollbar) {
          timer(500).subscribe(() => {
            this.commentScrollbar.scrollTo({ bottom: 0, end: 0, duration: 500 })
          })
        }
      })
    } else {
      Swal.fire(
        'Please type your comment',
        '',
        'warning'
      );
    }
  }

  editComment(id: string) {
    const data = this.formEditComment.value
    this.commentService.updateComment(data, id).subscribe((data: any) => {
      Swal.fire(
        data.msg,
        '',
        'success'
      );
      this.getPostByID()
      this.formEditComment.reset()
      this.modalCreateCommentRef?.hide()
    }, (err: any) => {
      Swal.fire(
        err.msg,
        '',
        'error'
      );
    })
  }

  deleteCommentByID(id: string) {
    this.sweetAlert.yesNo('Are you sure to delete this comment ?', (() => {
      this.commentService.deleteComment(id).subscribe((data: any) => {
        this.getPostByID()
        Swal.fire(
          data.msg,
          '',
          'success'
        );
      }, (err) => {
        Swal.fire(
          err.msg,
          '',
          'error'
        );
      })
    }))
  }

  deletePost(idPost: string) {
    this.sweetAlert.yesNo('Do you want to upload this image ?', () => {
      this.spinner.show();
      this.postService.deletePost(idPost).subscribe(
        (data: any) => {
          this.router.navigate([''])
          this.spinner.hide();
          Swal.fire(data.msg, 'Success', 'success');
        },
        (error) => {
          this.spinner.hide();
          console.log(error);
          Swal.fire(error.error.msg, 'Failed', 'error');
        }
      );
    });
  }

  selectImagesPost(event: any) {
    this.newImagesSelected = []
    this.selectedFiles = event.target.files;
    console.log("🚀 ~ this.selectedFiles:", this.selectedFiles)
    const numberOfFiles = this.selectedFiles.length;
    for (let i = 0; i < numberOfFiles; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newImagesSelected.push(e.target.result);
      };
      reader.readAsDataURL(this.selectedFiles[i]);
    }
  }

  deleteImagePost(index: number) {
    this.imagesSelected.splice(index, 1)
  }

  editPost() {
    const data = this.formEditPost.value
    data.images = this.imagesSelected
    this.postService.updatePost(data, this.postEditID, this.selectedFiles).subscribe((data: any) => {
      Swal.fire(
        data.msg,
        '',
        'success'
      );
      this.getPostByID()
      this.createPostModal.hide()
      this.formEditPost.reset()
      this.imagesSelected = []
      this.newImagesSelected = []
    })
  }

  countLikes(postLikers: any) {
    let checkUser = false
    let res = ''
    if (this.userSession && this.userSession._id) {
      postLikers.map((post: any) => {
        checkUser = post.userLikeID === this.userSession._id ? true : false
      })
    }
    if (checkUser && postLikers.length === 1) res = 'You'
    else if (checkUser && postLikers.length > 1) res = 'You and ' + (postLikers.length - 1) + ' others'
    else res = postLikers.length
    return res
  }

  openModalViewLikers(template: any) {
    template.show()
  }

  onAngleChanged(changeViews: boolean) {
    if (!changeViews) {
      timer(500).subscribe(() => {
        this.postService.getTopViewer(this.topPost).subscribe((data: any) => {
          this.postsViewers = data.data
          this.getPostByID()
        })
      })
    }
  }

  openFormEditComment(template: TemplateRef<any>, id: string, content: string) {
    this.formEditComment.get('content')?.setValue(content)
    this.modalCreateCommentRef = this.bsModalService.show(template);
  }

  openModalEditPost(id: string) {
    this.getPostByID()
    this.imagesSelected = []
    this.newImagesSelected = []
    this.formEditPost.get('title')?.setValue(this.post.title)
    this.formEditPost.get('content')?.setValue(this.post.content)
    this.formEditPost.get('tag')?.setValue(this.post.tag)
    this.createPostModal?.show()
  }

  trackByFn(index: number, item: any) {
    return item.id;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.postService.getPostByID(params['id']).subscribe((data: any) => {
        console.log('>>> get post moi');
        this.post = data.data
        this.imagesSelected = data.data.images
      })
    });
    // timer(500).subscribe(() => {
    //   this.inputComment.nativeElement.focus()
    // })
    // this.getPostByID()
    this.getUserSessionInfo()
    this.getTopPostsViewers(this.topPost)
    this.getTopPostsLikes(this.topPost)
  }

  ngOnDestroy(): void {
    console.log('destroy profile');

  }
}
