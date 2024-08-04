import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkInputComponent } from './link-input.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder } from '@angular/forms';

describe('LinkInputComponent', () => {
  let component: LinkInputComponent;
  let fixture: ComponentFixture<LinkInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkInputComponent],
      providers: [
        DynamicDialogConfig,
        DynamicDialogRef,
        FormBuilder
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LinkInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
