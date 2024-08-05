import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiptapImageComponent } from './tiptap-image.component';
import { DialogService } from 'primeng/dynamicdialog';
import { MediaService } from '../../../services/media.service';
import { BehaviorSubject, of } from 'rxjs';
import { SelectedImageConfig } from '../../media-library/media-library.component';
import { Node } from 'prosemirror-model';

describe('TiptapImageComponent', () => {
  let component: TiptapImageComponent;
  let fixture: ComponentFixture<TiptapImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiptapImageComponent],
      providers: [
        DialogService,
        {
          provide: MediaService,
          useValue: {
            getImageById$: () => of({
              success: false,
              error: 'TESTING'
            }),
            selectedImage: new BehaviorSubject({} as SelectedImageConfig)
          }
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TiptapImageComponent);
    component = fixture.componentInstance;
    component.node = {
      attrs: {
        imageId: 0,
        caption: 'MOCK_CAPTION'
      }
    } as unknown as Node;;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
