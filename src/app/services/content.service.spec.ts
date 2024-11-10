import { TestBed } from '@angular/core/testing';

import { ContentService } from './content.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ContentService', () => {
  let service: ContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi())]
});
    service = TestBed.inject(ContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
