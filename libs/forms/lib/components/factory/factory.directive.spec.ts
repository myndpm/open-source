import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynFormRegistry } from '@myndpm/dyn-forms/core';
import { MockProvider } from 'ng-mocks';
import { DynFactoryDirective } from './factory.directive';

describe('DynFactoryDirective', () => {
  let component: DynFactoryDirective;
  let fixture: ComponentFixture<DynFactoryDirective>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynFactoryDirective],
      providers: [
        MockProvider(DynFormRegistry),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynFactoryDirective);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
