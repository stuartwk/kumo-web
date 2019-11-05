import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {

  @Input() users: {username?: string, id: string}[];
  user_list_displayed: boolean;

  constructor() { }

}
