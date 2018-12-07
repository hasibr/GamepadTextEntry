import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentConfigComponent } from './experiment-config.component';

describe('ExperimentConfigComponent', () => {
  let component: ExperimentConfigComponent;
  let fixture: ComponentFixture<ExperimentConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperimentConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
