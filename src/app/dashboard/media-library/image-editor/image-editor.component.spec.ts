import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageEditorComponent } from './image-editor.component';

describe('ImageEditorComponent', () => {
  let component: ImageEditorComponent;
  let fixture: ComponentFixture<ImageEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageEditorComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ImageEditorComponent);
    component = fixture.componentInstance;
    component.image = {
      full: 'MOCK_URL',
      thumbnail: 'MOCK_URL',
      data: {
        filename: 'MOCK_FILENAME',
        path: '/',
        mimetype: 'MOCK_MIME_TYPE',
        name: 'MOCK_NAME',
        alt: 'MOCK_ALT'
      }
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
