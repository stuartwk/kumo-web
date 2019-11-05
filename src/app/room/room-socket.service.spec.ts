import { TestBed } from '@angular/core/testing';

import { RoomSocketService } from './room-socket.service';

describe('RoomSocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoomSocketService = TestBed.get(RoomSocketService);
    expect(service).toBeTruthy();
  });
});
