import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoenicianComponent } from './phoenician.component';

describe('PhoenicianComponent', () => {
  let component: PhoenicianComponent;
  let fixture: ComponentFixture<PhoenicianComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoenicianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoenicianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
