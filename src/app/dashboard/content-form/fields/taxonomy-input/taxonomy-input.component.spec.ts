import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxonomyInputComponent } from './taxonomy-input.component';
import { TaxonomyService } from '../../../services/taxonomy.service';
import { of } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { mockFormGroup } from '../../../test-helpers/content-formgroup';

describe('TaxonomyInputComponent', () => {
  let component: TaxonomyInputComponent;
  let fixture: ComponentFixture<TaxonomyInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TaxonomyInputComponent],
    providers: [
        {
            prvoide: TaxonomyService,
            useValue: {
                getTaxonomies$: () => of([])
            }
        },
        provideHttpClient(withInterceptorsFromDi())
    ]
})
      .compileComponents();

    fixture = TestBed.createComponent(TaxonomyInputComponent);
    component = fixture.componentInstance;
    component.formGroup = mockFormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
