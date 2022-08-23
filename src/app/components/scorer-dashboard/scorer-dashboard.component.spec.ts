import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScorerDashboardComponent } from './scorer-dashboard.component';

describe('ScorerDashboardComponent', () => {
  let component: ScorerDashboardComponent;
  let fixture: ComponentFixture<ScorerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScorerDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScorerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
