import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatsmanRankComponent } from './batsman-rank.component';

describe('BatsmanRankComponent', () => {
  let component: BatsmanRankComponent;
  let fixture: ComponentFixture<BatsmanRankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatsmanRankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatsmanRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
