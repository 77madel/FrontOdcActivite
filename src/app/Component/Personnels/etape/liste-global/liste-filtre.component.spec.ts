import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeFiltreComponent } from './liste-filtre.component';

describe('ListeGlobalComponent', () => {
  let component: ListeFiltreComponent;
  let fixture: ComponentFixture<ListeFiltreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeFiltreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeFiltreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
