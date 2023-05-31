import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, QueryList, SimpleChanges, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup } from "@angular/forms";
import { PostService } from "../services/post.service";
import Swal from 'sweetalert2';
import { Post } from "../models/post.model";
import { environment } from 'src/environments/environment';
import { UserService } from "../services/user.service";
import { User } from "../models/user.model";
import { trigger, transition, style, animate } from '@angular/animations';
import { SweetAlertService } from "../services/sweet-alert.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Slick } from "ngx-slickjs";
import { Title } from "@angular/platform-browser";
import { BsModalRef, BsModalService, ModalDirective } from "ngx-bootstrap/modal";
import { CommentService } from "../services/comment.service";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { NgScrollbar } from "ngx-scrollbar";
import { NotificationService } from "../services/notification.service";
import { SocketService } from "../services/socket.service";
import { Socket } from "ngx-socket-io";
import { NoticeService } from "../services/notice.service";
import { Notice } from "../models/notice.model";
import { global } from "../shared/global";
import { Subject, Subscription, takeUntil, timer } from "rxjs";
// import { Socket, io } from 'socket.io-client'
// const socket = io('ws://localhost:8000')

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  @ViewChild('createPostModal', { static: true }) createPostModal: ModalDirective;
  @ViewChildren('commentScrollbar') commentScrollbar: QueryList<NgScrollbar>;

  // @ViewChild('editPost', { static: false }) editPost?: ModalDirective;
  // modalEditPost: BsModalRef
  // private socket: Socket
  private unsub = new Subject<void>();
  formCreatePost = new FormGroup({
    title: new FormControl(),
    content: new FormControl(),
    tag: new FormControl(),
    images: new FormControl(),
  });

  formCreateComment = new FormGroup({
    content: new FormControl(),
  });

  formEditComment = new FormGroup({
    content: new FormControl(),
  });

  imagesSelected: string[] = []
  newImagesSelected: string[] = []
  selectedFiles: any
  posts: Post[]
  postEdit: Post
  imagePath = global.imagePath
  userSession: User
  postEditID: string
  isCreate: boolean = false
  isEdit: boolean = false
  postsCount: number
  limitPost: number = 4
  page: number = 1;
  modalCreateCommentRef?: BsModalRef;
  indexPost: number
  modalViewLikers?: BsModalRef;
  postTopComments: Post[]
  postTopCommentsCount: number = 3
  currentPostHeader: Post
  dataSocket: any
  isPostsTag: string = ''
  listTags = global.listTags
  currentPage: number = 1
  defaultImage = global.defaultImage
  listNotices: Notice[] = []

  constructor(private authService: AuthService, private router: Router, private postService: PostService, private userService: UserService, private sweetAlert: SweetAlertService, private spinner: NgxSpinnerService, private cdr: ChangeDetectorRef, private title: Title, private bsModalService: BsModalService, private commentService: CommentService, private route: ActivatedRoute, public notificationService: NotificationService, private socket: Socket, private noticeService: NoticeService) {
    title.setTitle("Tuanna Blog")
    this.socket.on('notice', (data: any) => {
      console.log('Dữ liệu từ máy chủ:', data);
      this.dataSocket = data
    });
  }

  openModalViewLikers(template: any) {
    template.show()
  }

  trackByFn(index: number, item: any) {
    return item.id;
  }

  getAllPosts() {
    this.postService.getAllPosts(this.page, this.limitPost).pipe(takeUntil(this.unsub)).subscribe((data: any) => {
      this.posts = data.data
      console.log(`🚀 ~ data.data:`, data.data)
      this.postsCount = Number(data.postsCount)
    })
  }

  getPostsByTag(tag: string) {
    this.postService.getPostsByTag(tag, this.page, this.limitPost).pipe(takeUntil(this.unsub)).subscribe((data: any) => {
      console.log(`🚀 ~ data:`, data)
      this.posts = data.data
      this.isPostsTag = tag
      this.postsCount = data.postsCount
    })
  }

  resetAllPosts(event: any) {
    timer(200).subscribe(() => {
      this.currentPage = 1
    })
    this.isPostsTag = ''
    event && this.getAllPosts()
  }

  getPostToEditByID(id: string) {
    this.postEditID = id
    this.postService.getPostByID(id).pipe(takeUntil(this.unsub)).subscribe((data: any) => {
      this.postEdit = data.data
      this.formCreatePost.get('title')?.setValue(this.postEdit.title);
      this.formCreatePost.get('content')?.setValue(this.postEdit.content);
      this.formCreatePost.get('tag')?.setValue(this.postEdit.tag);
      this.createPostModal?.show()
      this.isEdit = true
      this.isCreate = false
      this.imagesSelected = data.data.images
    })
  }

  createPost(modal: any) {
    if (!this.formCreatePost.get('title')?.value || !this.formCreatePost.get('content')?.value || !this.formCreatePost.get('tag')?.value) {
      Swal.fire(
        'Please enter full field',
        '',
        'warning'
      );
      return
    }
    if (this.selectedFiles == undefined) {
      Swal.fire(
        'You have not selected any photos yet',
        '',
        'warning'
      );
      return
    }
    this.postService.createPost(this.formCreatePost.value, this.selectedFiles).subscribe((data: any) => {
      this.getAllPosts()
      Swal.fire(
        data.msg,
        '',
        'success'
      );
      modal.hide()
      this.formCreatePost.reset()
      this.imagesSelected = []
    })
  }

  updatePostViews(id: string) {
    this.postService.updatePostViews(id).subscribe((data) => {
      console.log(`🚀 ~ data:`, data)
      // this.getAllPosts()
    })
  }

  editPost() {
    const data = this.formCreatePost.value
    data.images = this.imagesSelected
    this.postService.updatePost(data, this.postEditID, this.selectedFiles).subscribe((data: any) => {
      Swal.fire(
        data.msg,
        '',
        'success'
      );
      this.isPostsTag ? this.getPostsByTag(this.isPostsTag) : this.getAllPosts()
      this.createPostModal.hide()
      this.formCreatePost.reset()
      this.imagesSelected = []
      this.newImagesSelected = []
    })
  }

  setPostHeader(id: string) {
    this.postService.getPostByID(id).subscribe((data: any) => {
      this.currentPostHeader = data.data
    })
  }

  selectImagesPost(event: any) {
    this.newImagesSelected = []
    this.selectedFiles = event.target.files;
    const numberOfFiles = this.selectedFiles.length;
    for (let i = 0; i < numberOfFiles; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.isCreate) {
          this.imagesSelected.push(e.target.result);
        } else if (this.isEdit) {
          this.newImagesSelected.push(e.target.result);
        }
      };
      reader.readAsDataURL(this.selectedFiles[i]);
    }
  }

  deleteImagePost(index: number) {
    this.imagesSelected.splice(index, 1)
  }

  roundUpNumber(): number {
    const pageCount = (this.postsCount / this.limitPost) * 10
    return Math.floor(pageCount) !== Math.ceil(pageCount) ? pageCount + 1 : pageCount
  }

  updateStatusLike(event: any, idPost: string) {
    // this.socket.emit('notice', { name: 'tuan', age: 25 });
    this.userService.updateLikes({
      like: event.target.checked,
      idPost
    }).subscribe((data: any) => {
      // this.getAllPosts()
      this.isPostsTag ? this.getPostsByTag(this.isPostsTag) : this.getAllPosts()
      this.getUserSessionInfo()
    })
  }

  deletePost(idPost: string) {
    this.sweetAlert.yesNo('Do you want to upload this image ?', () => {
      this.spinner.show();
      this.postService.deletePostByID(idPost).subscribe(
        (data: any) => {
          this.getTopPostsComment()
          this.isPostsTag ? this.getPostsByTag(this.isPostsTag) : this.getAllPosts()
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

  getUserSessionInfo() {
    this.userService.getUserInfo().pipe(takeUntil(this.unsub)).subscribe((data: any) => {
      this.userSession = data.data
    })
  }

  openModalCreatePost() {
    this.formCreatePost.reset()
    this.isCreate = true
    this.isEdit = false
    this.imagesSelected = []
    this.newImagesSelected = []
    this.createPostModal?.show()
  }

  openModalEditPost(id: string) {
    this.getPostToEditByID(id)
    this.isEdit = true
    this.isCreate = false
    this.createPostModal?.show()
  }

  createComment(postID: string, index: number) {
    const content = this.formCreateComment.get('content')?.value
    this.indexPost = index % this.limitPost
    if (content) {
      this.notificationService.comment()
      this.commentService.createComment({ postID: postID, content }).subscribe((data) => {
        this.isPostsTag ? this.getPostsByTag(this.isPostsTag) : this.getAllPosts()
        this.formCreateComment.reset()

        if (this.commentScrollbar) {
          timer(500).subscribe(() => {
            this.commentScrollbar.toArray()[this.indexPost].scrollTo({ bottom: 0, end: 0, duration: 500 })
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
      this.isPostsTag ? this.getPostsByTag(this.isPostsTag) : this.getAllPosts()
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
        this.isPostsTag ? this.getPostsByTag(this.isPostsTag) : this.getAllPosts()
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

  countLikes(postLikers: any) {
    let checkUser = false
    let res = ''
    if (this.userSession && this.userSession._id) {
      postLikers.map((post: any) => {
        checkUser = post._id === this.userSession._id ? true : false
      })
    }
    if (checkUser && postLikers.length === 1) res = 'You'
    else if (checkUser && postLikers.length > 1) res = 'You and ' + (postLikers.length - 1) + ' others'
    else res = postLikers.length
    return res
  }

  getLikers(postLikers: any) {
    let res = ''
    postLikers.map((liker: any) => res += liker.username + "\n")
    return res
  }

  pageChanged(event: PageChangedEvent): void {
    this.page = event.page;
    this.router.navigate([''], { queryParams: { page: this.page, limit: this.limitPost } });
    this.isPostsTag && this.getPostsByTag(this.isPostsTag)
  }

  openFormEditComment(template: TemplateRef<any>, id: string, content: string) {
    this.formEditComment.get('content')?.setValue(content)
    this.modalCreateCommentRef = this.bsModalService.show(template);
  }

  getTopPostsComment() {
    this.postService.getTopComments(this.postTopCommentsCount).pipe(takeUntil(this.unsub)).subscribe((data: any) => {
      this.postTopComments = data.data
      this.currentPostHeader = this.postTopComments[0]
    })
  }

  ngOnInit(): void {
    this.getUserSessionInfo()
    this.getTopPostsComment()

    this.route.queryParams.subscribe((params: Params) => {
      console.log(params['page']);
      if (params['page'] && params['limit']) {
        this.page = Number(params['page'])
        this.limitPost = params['limit'];
        this.isPostsTag ? this.getPostsByTag(this.isPostsTag) : this.getAllPosts()
      }
    });
    this.getAllPosts()
  }

  ngOnDestroy(): void {
    this.unsub.next()
    this.unsub.complete()
  }
}


