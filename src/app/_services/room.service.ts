import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

/** DTO */
import { RoomDTO } from '../_models/room-dto';
import { RoomRO, RoomLoginRO } from '../room/room.interface';

/** RXJS */
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) { }

  create(data: {name: string, is_private: boolean, password: string}): Observable<RoomRO> {
    return this.http.post<RoomRO>(`${environment.base_url}/rooms`, data);
  }

  show(room_id: string): Observable<RoomRO> {
    return this.http.get<RoomRO>(`${environment.base_url}/rooms/${room_id}`);
  }

  updateRoom(room_id: string, update: {name: string, is_private: boolean, password: string}) {

    return this.http.put(`${environment.base_url}/rooms/${room_id}`, update);

  }

  loginToRoom(room_id: string, loginRoomDto: {username: string, password: string}): Observable<RoomLoginRO> {
    return this.http.post<RoomLoginRO>(`${environment.base_url}/rooms/${room_id}/login`, loginRoomDto)
    .pipe(
      tap( (roomLoginRO: RoomLoginRO) => this.setSession(room_id, roomLoginRO)),
    );
  }

  private setSession(room_id: string, roomLoginRO: RoomLoginRO) {
    localStorage.setItem(room_id, JSON.stringify(roomLoginRO));
  }

}
