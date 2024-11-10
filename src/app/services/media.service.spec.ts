import { TestBed } from '@angular/core/testing';

import { MediaService } from './media.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MediaService', () => {
  let service: MediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi())]
});
    service = TestBed.inject(MediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
