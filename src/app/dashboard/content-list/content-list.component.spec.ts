import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentListComponent } from './content-list.component';
import { ContentService } from '../../services/content.service';
import { of } from 'rxjs';

describe('ContentListComponent', () => {
  let component: ContentListComponent;
  let fixture: ComponentFixture<ContentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentListComponent],
      providers: [
        {
          provide: ContentService,
          useValue: {
            getContentByType$: () => of({
              success: true,
              data: []
            })
          }
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ContentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
