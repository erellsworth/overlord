import { ComponentFixture, TestBed } from '@angular/core/testing';

import { uploadedFile, UploaderComponent } from './uploader.component';
import { FormBuilder } from '@angular/forms';
import { MediaService } from '../../../services/media.service';

describe('UploaderComponent', () => {
  let component: UploaderComponent;
  let fixture: ComponentFixture<UploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploaderComponent],
      providers: [
        FormBuilder,
        {
          provide: MediaService,
          useValue: {}
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UploaderComponent);
    component = fixture.componentInstance;
    const mockBlob = new Blob();
    const mockFile = new File([''], 'filename', { type: 'image/jpg' }) as uploadedFile;
    mockFile.objectURL = '';
    component.file = mockFile;;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
