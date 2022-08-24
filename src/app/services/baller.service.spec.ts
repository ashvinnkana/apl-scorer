import { TestBed } from '@angular/core/testing';

import { BallerService } from './baller.service';

describe('BallerService', () => {
  let service: BallerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BallerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
