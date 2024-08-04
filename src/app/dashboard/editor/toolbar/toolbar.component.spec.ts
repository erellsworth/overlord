import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Editor } from '@tiptap/core';
import { ToolbarComponent } from './toolbar.component';
import { DialogService } from 'primeng/dynamicdialog';
import { MediaService } from '../../../services/media.service';
import StarterKit from '@tiptap/starter-kit';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarComponent],
      providers: [
        DialogService,
        {
          provide: MediaService,
          useValue: {}
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    component.editor = new Editor({
      extensions: [StarterKit]
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
