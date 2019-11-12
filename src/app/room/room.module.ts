import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

/** COMPONENTS */
import { ChargeComponent } from './charge/charge.component';
import { LoginComponent } from './login/login.component';
import { RoomComponent } from './room.component';
import { ThreadComponent } from './thread/thread.component';
import { UserListComponent } from './thread/user-list/user-list.component';

/** DIRECTIVES */
import { AutoGrowDirective } from '../_directives/auto-grow.directive';

/** SERVICES */
import { RoomService } from '../_services/room.service';

/** MODULES */
import { SubHeaderModule } from '../_modules/sub-header/sub-header.module';

/** EXTERNAL */
import { QRCodeModule } from 'angularx-qrcode';
import {  NgxEmojiPickerModule  } from 'ngx-emoji-picker';


@NgModule({
  declarations: [RoomComponent, ThreadComponent, LoginComponent, AutoGrowDirective, ChargeComponent, UserListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QRCodeModule,
    SubHeaderModule,
    NgxEmojiPickerModule,
    RouterModule.forChild([
      {
        path: '',
        component: ThreadComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'invoice',
        component: ChargeComponent
      }
    ])
  ],
  providers: [RoomService]
})
export class RoomModule { }
