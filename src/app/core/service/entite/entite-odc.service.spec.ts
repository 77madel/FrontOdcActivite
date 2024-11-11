import { TestBed } from '@angular/core/testing';

import { EntiteOdcService } from './entite-odc.service';

describe('EntiteOdcService', () => {
  let service: EntiteOdcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntiteOdcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
