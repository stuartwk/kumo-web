import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators } from '@angular/forms';

/** SERVICES */
import { RoomService } from '../../_services/room.service';

/** RXJS */
import { Subscription } from 'rxjs';

/** INTERFACES */
import { RoomRO } from '../room.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  room_id: string;
  route_sub: Subscription;
  login_room_form: FormGroup;
  is_private: boolean;
  loading: boolean;
  err_message: string;

  constructor(private router: Router, private route: ActivatedRoute, private roomService: RoomService, private fb: FormBuilder) {
    this.loading = true;
  }

  ngOnInit() {
    this.route_sub = this.route.paramMap.subscribe(params => {
      this.room_id = params.get('id');

      if (this.room_id) {
        this.getRoom();
      } else {
        this.router.navigate(['/', '404']);
      }

    });
  }

  getRoom() {
    this.roomService.show(this.room_id).subscribe(
      (roomDto: RoomRO) => {

        const _room = roomDto.room;

        this.is_private = (_room && _room.isPrivate) ? true : false;

        this.login_room_form = this.fb.group({
          user_name: ['', Validators.required],
          password: this.is_private ? ['', Validators.required] : ['']
        });

        this.loading = false;
      },
      (err) => console.error('error getting room: ', err)
    );
  }

  onSubmit() {
    this.loading = true;

    const login_form = this.login_room_form.value;

    if (login_form.user_name.length < 1) {
      this.err_message = 'Please enter a username';
      this.loading = false;
      return;
    }

    const setupDTO = {
      username: login_form.user_name,
      password: login_form.password
    };

    this.roomService.loginToRoom(this.room_id, setupDTO).subscribe(
      (_) => {
        this.router.navigate(['/', this.room_id]);
      },
      (err) => {
        console.error('error logging into room: ', err);
        this.err_message = err.error.message;
        this.loading = false;
      },
    );
  }

  ngOnDestroy() {
    this.route_sub.unsubscribe();
  }

}
