import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorComponent } from './editor.component';
import { Injector } from '@angular/core';
import { MediaService } from '../../services/media.service';
import { BehaviorSubject } from 'rxjs';
import { SelectedImageConfig } from '../media-library/media-library.component';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorComponent],
      providers: [
        Injector,
        {
          provide: MediaService,
          useValue: {
            selectedImage: new BehaviorSubject({} as SelectedImageConfig)
          }
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
