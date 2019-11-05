import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  getRoomUser(room_id): {username: string, id: string} {
    const room_data = this.getLocalRoomData(room_id);
    return (room_data && room_data.user) ? room_data.user : null;
  }

  getLocalRoomData(room_id) {
    const room_storage_string = localStorage.getItem(room_id);
    return JSON.parse(room_storage_string);
  }

}
