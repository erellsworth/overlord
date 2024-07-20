import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxonomyInputComponent } from './taxonomy-input.component';

describe('TaxonomyInputComponent', () => {
  let component: TaxonomyInputComponent;
  let fixture: ComponentFixture<TaxonomyInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxonomyInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaxonomyInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
