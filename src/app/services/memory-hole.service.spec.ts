import { TestBed } from '@angular/core/testing';

import { MemoryHoleService } from './memory-hole.service';

describe('MemoryHoleService', () => {
  let service: MemoryHoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemoryHoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
