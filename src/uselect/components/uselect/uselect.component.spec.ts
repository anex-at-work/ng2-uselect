import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UselectComponent } from './uselect.component';

describe('UselectComponent', () => {
  let component: UselectComponent;
  let fixture: ComponentFixture<UselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UselectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
