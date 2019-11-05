import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RoomLoginRO } from './room.interface';

/** SOCKET.IO */
import * as io from 'socket.io-client';

/** RXJS */
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomSocketService {

  private url = `${environment.base_url}/room`;
  private socket;
  private usersSource: Subject<
    {username?: string, id: string, type: 'connectedUser' | 'rollCall' | 'disconnectedUser'}> = new Subject<null>();
  users$ = this.usersSource.asObservable();

  private messageSource: Subject<{user: {username: string, id: string}, content: string, sent_at: Date}> = new Subject<null>();
  message$ = this.messageSource.asObservable();

  constructor() { }

  public connect(room_id: string): void {

    const room_storage_string = localStorage.getItem(room_id);
    const room_storage: RoomLoginRO = JSON.parse(room_storage_string);

    this.socket = io(`${this.url}?room_id=${room_id}&user_id=${room_storage.user.id}`);

    this.socket.on('connect', () => {
      this.joinRoom(room_id);
    });

    this.socket.on('userConnected', (data: {user: {username: string, id: string}}) => {
      this.usersSource.next({...data.user, type: 'connectedUser'});
    });

    this.socket.on('rollCall', (data: {user: {username: string, id: string}}) => {
      this.usersSource.next({...data.user, type: 'rollCall'});
    });

    this.socket.on('userDisconnected', (data: {user: {username: string, id: string}}) => {
      this.usersSource.next({...data.user, type: 'disconnectedUser'});
    });

    this.socket.on('message', (data: {content: string, user: {username: string, id: string}, sent_at: Date}) => {
      this.messageSource.next(data);
    });

  }

  joinRoom(room_id: string): void {

    const room_storage_string = localStorage.getItem(room_id);
    const room_storage: RoomLoginRO = JSON.parse(room_storage_string);

    this.socket.emit('joinChatRoom', {token: room_storage.token});

  }

  rollCall(room_id: string): void {

    const room_storage_string = localStorage.getItem(room_id);
    const room_storage: RoomLoginRO = JSON.parse(room_storage_string);

    this.socket.emit('rollCall', {token: room_storage.token});
  }

  sendMessage(data: {message_content: string, room_id: string}) {
    const room_storage_string = localStorage.getItem(data.room_id);
    const room_storage: RoomLoginRO = JSON.parse(room_storage_string);

    this.socket.emit('sendMessage', {token: room_storage.token, message_content: data.message_content});
  }

  disconnect() {

    if (this.socket) {
      this.socket.disconnect();
    }

  }

}
