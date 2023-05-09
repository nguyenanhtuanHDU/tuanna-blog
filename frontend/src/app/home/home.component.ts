import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup } from "@angular/forms";
import { PostService } from "../services/post.service";
import Swal from 'sweetalert2';
import { Post } from "../models/post.model";
import { environment } from 'src/environments/environment';
import { formatDistanceToNow } from 'date-fns';
import { UserService } from "../services/user.service";
import { User } from "../models/user.model";
import { trigger, transition, style, animate } from '@angular/animations';
import { SweetAlertService } from "../services/sweet-alert.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Slick } from "ngx-slickjs";
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.5s ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class HomeComponent {
  @ViewChild('scrollContainer', { static: true }) scrollContainer: ElementRef;
  formCreatePost = new FormGroup({
    title: new FormControl(),
    content: new FormControl(),
    tag: new FormControl(),
    images: new FormControl(),
  });
  imagesSelected: string[] = []
  selectedFiles: any
  posts: Post[]
  imagePath = environment.apiBackend + '/images/'
  userSession: User

  constructor(private authService: AuthService, private router: Router, private postService: PostService, private userService: UserService, private sweetAlert: SweetAlertService, private spinner: NgxSpinnerService, private cdr: ChangeDetectorRef, private title: Title) {
    title.setTitle("Tuanna Blog")
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

  getAllPosts() {
    this.postService.getAllPosts().subscribe((data: any) => {
      this.posts = data.data
      this.cdr.detectChanges();
      console.log("🚀 ~ cap nhat post:", data.data)
    })
  }

  createPost(modal: any) {
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

  selectImagesPost(event: any) {
    this.selectedFiles = event.target.files;
    const numberOfFiles = this.selectedFiles.length;
    for (let i = 0; i < numberOfFiles; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagesSelected.push(e.target.result);
      };
      reader.readAsDataURL(this.selectedFiles[i]);
    }
  }

  deleteImagePost(index: number) {
    this.imagesSelected.splice(index, 1)
  }

  formatTimeAgo(time: any) {
    return formatDistanceToNow(new Date(time), { addSuffix: true, includeSeconds: true });
  }

  updateStatusLike(event: any, idPost: string) {
    this.userService.updateLikes({
      like: event.target.checked,
      idPost
    }).subscribe((data: any) => {
      console.log("🚀 ~ data:", data)
      this.getAllPosts()
      this.getUserSessionInfo()
    })
  }

  deletePost(idPost: string) {
    this.sweetAlert.yesNo('Do you want to upload this image ?', () => {
      this.spinner.show();
      this.postService.deletePost(idPost).subscribe(
        (data: any) => {
          this.getAllPosts()
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
    this.userService.getUserInfo().subscribe((data: any) => {
      this.userSession = data.data
    })
  }

  ngOnInit(): void {
    this.getUserSessionInfo()
    const token = this.authService.checkToken();
    if (
      !token
    ) {
      this.router.navigate(['/login']);
      return;
    }
    this.getAllPosts()
  }
}


