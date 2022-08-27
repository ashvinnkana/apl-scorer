import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotsRankComponent } from './mots-rank.component';

describe('MotsRankComponent', () => {
  let component: MotsRankComponent;
  let fixture: ComponentFixture<MotsRankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotsRankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotsRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
