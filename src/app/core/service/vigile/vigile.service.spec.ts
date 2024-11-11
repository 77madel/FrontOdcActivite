import { TestBed } from '@angular/core/testing';

import { VigileService } from './vigile.service';

describe('VigileService', () => {
  let service: VigileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VigileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
