import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio();
  }

  like() {
    this.audio.src = '../assets/audio/like.mp3';
    this.audio.play();
  }

  comment() {
    this.audio.src = '../assets/audio/comment.mp3';
    this.audio.play();
  }
}
