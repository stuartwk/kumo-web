import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

/** SERVICES */
import { RoomService } from '../_services/room.service';

/** INTERFACES */
import { RoomRO } from 'src/app/room/room.interface';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent {

  setup_room_form: FormGroup;
  room_id: string;
  loading: boolean;

  constructor(private fb: FormBuilder, private roomService: RoomService, private router: Router) {
    this.setup_room_form = this.fb.group({
      room_name:              ['', Validators.required],
      room_password:          [''],
      room_password_confirm:  [''],
      is_private:             [true],
    });
  }

  onSubmit() {

    const setup = this.setup_room_form.value;
    this.loading = true;

    if (setup.room_password !== setup.room_password_confirm) {
      console.warn('passwords dont match');
      return;
    }

    const setupDTO = {
      name: setup.room_name,
      is_private: true,
      password: setup.room_password
    };

    this.roomService.create(setupDTO).subscribe(
      (res: RoomRO) => {
        const room = res.room;
        this.router.navigate(['/', room.id, 'invoice']);
      },
      (err) => {
        console.error('error creating room: ', err);
        this.loading = false;
      }
    );

  }

}
