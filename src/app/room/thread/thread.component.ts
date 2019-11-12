import { Component, OnInit, OnDestroy , ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

/** INTERFACES */
import { RoomRO } from '../room.interface';

/** SERVICES */
import { LocalStorageService } from '../../_services/local-storage.service';
import { RoomService } from '../../_services/room.service';
import { RoomSocketService } from '../room-socket.service';

/** RXJS */
import { Subscription } from 'rxjs';
import { RoomDTO } from 'src/app/_models/room-dto';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
  providers: [RoomSocketService]
})
export class ThreadComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('scrollMe', {static: false}) private myScrollContainer: ElementRef;
  @ViewChild('heightMe', {static: false}) private heightMeContainer: ElementRef;
  room_id: string;
  room: RoomDTO;
  subs: Subscription[];
  user: {username?: string, id: string};
  users: {username?: string, id: string}[];
  messages: {user: {username: string, id: string}, content: string, sent_at: Date}[];
  message_to_send: FormControl;
  sending_message: boolean;
  user_list_displayed: boolean;
  display_link_copied_message: boolean;
  offset: number;
  emoji_box_open: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private roomService: RoomService,
    private roomSocketService: RoomSocketService,
    private localStorageService: LocalStorageService,
  ) {
    this.subs = [];
    this.users = [];
    this.messages = [];
    this.sending_message = false;
    this.user_list_displayed = false;
    this.display_link_copied_message = false;
    this.emoji_box_open = false;

    const connected_users$ = this.roomSocketService.users$.subscribe( (data) => {

      if (data.type === 'disconnectedUser') {

        this.users = this.users.filter( (user) => user.id !== data.id );

      } else if (data.type === 'connectedUser') {

        const existing = this.users.find( (user) => user.id === data.id);

        if (!existing) {
          this.users.push(data);
        }

        this.roomSocketService.rollCall(this.room_id);
      } else {

        const existing = this.users.find( (user) => user.id === data.id);

        if (!existing) {
          this.users.push(data);
        }

      }

    });

    this.subs.push(connected_users$);

    const message$ = this.roomSocketService.message$.subscribe( (data) => {
      this.messages.push(data);

      if (data.user.id === this.user.id) {
        this.sending_message = false;
      }

      this.scrollToBottom();

    });

    this.subs.push(message$);

    this.message_to_send = new FormControl('', [Validators.required]);
  }

  scrollToBottom(): void {
    try {
      window.scrollTo(0, this.myScrollContainer.nativeElement.scrollHeight);
    } catch (err) {
      console.log('err scroll to bottom: ', err);
    }
  }

  ngAfterViewInit() {

    setTimeout(() => this.offset = this.heightMeContainer.nativeElement.scrollHeight + 230);

  }

  ngOnInit() {
    const route_sub = this.route.paramMap.subscribe(params => {
      this.room_id = params.get('id');

      if (this.room_id) {
        this.getRoom();
      } else {
        this.router.navigate(['/', '404']);
      }

    });

    this.subs.push(route_sub);

  }

  handleEmojiSelect($e) {
    const message = this.message_to_send.value;
    this.message_to_send.setValue(message + $e.char);
  }

  getRoom() {
    this.roomService.show(this.room_id).subscribe(
      (roomDto: RoomRO) => {

        this.room = roomDto.room;
        this.user = this.localStorageService.getRoomUser(this.room.id);

        if (this.user) {
          this.roomSocketService.connect(this.room.id);
        } else {
          this.router.navigate(['/', this.room.id, 'login']);
        }

      },
      (err) => console.error('error getting room: ', err)
    );
  }

  copyLink() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = `https://kumo.chat/${this.room.id}/login`;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.displayLinkCopiedMessage();
  }

  displayLinkCopiedMessage() {
    this.display_link_copied_message = true;

    setTimeout(() => {
      this.display_link_copied_message = false;
    }, 3000);
  }

  sendMessage($e) {

    $e.preventDefault();

    this.sending_message = true;

    let content = this.message_to_send.value;
    content = content.trim();

    if (content.length > 0) {
      this.roomSocketService.sendMessage({message_content: content, room_id: this.room_id});
      this.message_to_send.patchValue('');
    }

  }

  ngOnDestroy() {
    for (const sub of this.subs) {
      sub.unsubscribe();
    }
    this.roomSocketService.disconnect();
  }

}
