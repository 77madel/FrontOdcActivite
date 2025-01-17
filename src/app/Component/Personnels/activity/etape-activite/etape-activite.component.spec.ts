import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtapeActiviteComponent } from './etape-activite.component';

describe('EtapeActiviteComponent', () => {
  let component: EtapeActiviteComponent;
  let fixture: ComponentFixture<EtapeActiviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtapeActiviteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtapeActiviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
