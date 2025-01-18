import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleInputComponent } from './title-input.component';
import { FormBuilder } from '@angular/forms';
import { mockFormGroup } from '../../../test-helpers/content-formgroup';

describe('TitleInputComponent', () => {
  let component: TitleInputComponent;
  let fixture: ComponentFixture<TitleInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleInputComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TitleInputComponent);
    component = fixture.componentInstance;
    component.formGroup = mockFormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
