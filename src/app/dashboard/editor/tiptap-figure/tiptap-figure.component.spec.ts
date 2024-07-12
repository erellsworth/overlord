import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiptapFigureComponent } from './tiptap-figure.component';

describe('TiptapFigureComponent', () => {
  let component: TiptapFigureComponent;
  let fixture: ComponentFixture<TiptapFigureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiptapFigureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TiptapFigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
