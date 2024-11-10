import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentFormComponent } from './content-form.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ContentService } from '../../services/content.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ContentFormComponent', () => {
  let component: ContentFormComponent;
  let fixture: ComponentFixture<ContentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ContentFormComponent],
    providers: [
        ConfirmationService,
        {
            provide: ContentService,
            useValue: {
                getContentBySlug$: () => of({
                    success: false,
                    error: 'MOCK_ERROR'
                })
            }
        },
        FormBuilder,
        MessageService,
        Router,
        provideHttpClient(withInterceptorsFromDi())
    ]
})
      .compileComponents();

    fixture = TestBed.createComponent(ContentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
