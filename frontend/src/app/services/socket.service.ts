import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import { io } from 'socket.io-client'
const socket = io('ws://localhost:8000')

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  // constructor() {

  // }
  getNotice(str: string) {
    socket.emit('event', str)
    socket.on('event', (data: any) => {
      console.log(`🚀 ~ data:`, data)
    })
  }
}
