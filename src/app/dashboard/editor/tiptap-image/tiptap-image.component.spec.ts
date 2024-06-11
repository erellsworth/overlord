import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiptapImageComponent } from './tiptap-image.component';

describe('TiptapImageComponent', () => {
  let component: TiptapImageComponent;
  let fixture: ComponentFixture<TiptapImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiptapImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TiptapImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
