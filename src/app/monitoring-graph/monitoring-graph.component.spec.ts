import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringGraphComponent } from './monitoring-graph.component';

describe('MonitoringGraphComponent', () => {
  let component: MonitoringGraphComponent;
  let fixture: ComponentFixture<MonitoringGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
