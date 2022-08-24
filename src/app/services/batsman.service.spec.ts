import { TestBed } from '@angular/core/testing';

import { BatsmanService } from './batsman.service';

describe('BatsmanService', () => {
  let service: BatsmanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatsmanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
