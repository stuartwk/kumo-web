import { TestBed } from '@angular/core/testing';

import { ChargeService } from './charge.service';

describe('ChargeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChargeService = TestBed.get(ChargeService);
    expect(service).toBeTruthy();
  });
});
