import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComponent } from './menu.component';
import { ContentService } from '../../services/content.service';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, MenuComponent],
      providers: [
        {
          provide: ContentService,
          userValue: {
            getContentTypes$: () => of({
              success: true,
              data: ['post', 'page']
            })
          }
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
