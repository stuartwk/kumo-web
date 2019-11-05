import { RoomDTO } from '../_models/room-dto';

export interface RoomRO {
  room: RoomDTO;
}

export interface RoomLoginRO {
  token: string;
  user: {
    id: string;
    username: string;
  };
}
