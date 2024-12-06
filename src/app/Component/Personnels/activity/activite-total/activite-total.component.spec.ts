import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiviteTotalComponent } from './activite-total.component';

describe('ActiviteTotalComponent', () => {
  let component: ActiviteTotalComponent;
  let fixture: ComponentFixture<ActiviteTotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiviteTotalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiviteTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
