import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BowlerRankComponent } from './bowler-rank.component';

describe('BowlerRankComponent', () => {
  let component: BowlerRankComponent;
  let fixture: ComponentFixture<BowlerRankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BowlerRankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BowlerRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
