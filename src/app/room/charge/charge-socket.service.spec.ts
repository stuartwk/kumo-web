import { TestBed } from '@angular/core/testing';

import { ChargeSocketService } from './charge-socket.service';

describe('ChargeSocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChargeSocketService = TestBed.get(ChargeSocketService);
    expect(service).toBeTruthy();
  });
});
