import { TestBed } from '@angular/core/testing';

import { ATProService } from './atpro.service';

describe('ATProService', () => {
  let service: ATProService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ATProService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
