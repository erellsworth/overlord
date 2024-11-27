import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { contentResolver } from './content.resolver';

describe('contentResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => contentResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
