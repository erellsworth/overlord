import { TestBed } from '@angular/core/testing';

import { TaxonomyService } from './taxonomy.service';
import { HttpClientModule } from '@angular/common/http';

describe('TaxonomyService', () => {
  let service: TaxonomyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(TaxonomyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
