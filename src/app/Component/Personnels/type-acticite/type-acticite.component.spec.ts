import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeActiciteComponent } from './type-acticite.component';

describe('TypeActiciteComponent', () => {
  let component: TypeActiciteComponent;
  let fixture: ComponentFixture<TypeActiciteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeActiciteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeActiciteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
