import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaLibraryComponent } from './media-library.component';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MediaService } from '../../services/media.service';
import { MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { signal } from '@angular/core';
import { Image } from 'primeng/image';

describe('MediaLibraryComponent', () => {
  let component: MediaLibraryComponent;
  let fixture: ComponentFixture<MediaLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, MediaLibraryComponent],
      providers: [
        {
          provide: DynamicDialogConfig,
          useValue: {}
        },
        {
          provide: MediaService,
          useValue: {
            loadMedia: () => { },
            media: signal<{ [key: number]: Image[] }>({
              1: []
            })

          }
        },
        MessageService
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MediaLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
