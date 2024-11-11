import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntiteODCComponent } from './entite-odc.component';

describe('EntiteODCComponent', () => {
  let component: EntiteODCComponent;
  let fixture: ComponentFixture<EntiteODCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntiteODCComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntiteODCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
