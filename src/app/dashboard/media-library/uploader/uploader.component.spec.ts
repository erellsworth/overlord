import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploaderComponent } from './uploader.component';
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
    component.file = {
      name: 'MOCK_NAME',
      objectURL: '',
      lastModified: 1,
      webkitRelativePath: '',
      size: 0,
      type: '',
      arrayBuffer: mockBlob.arrayBuffer,
      slice: () => mockBlob,
      text: () => mockBlob.text(),
      stream: () => mockBlob.stream()
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
