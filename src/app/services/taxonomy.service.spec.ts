import { TestBed } from '@angular/core/testing';

import { TaxonomyService } from './taxonomy.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TaxonomyService', () => {
  let service: TaxonomyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi())]
});
    service = TestBed.inject(TaxonomyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
