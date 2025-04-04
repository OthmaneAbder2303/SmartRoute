import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FuncionalitiesComponent } from './funcionalities.component';

describe('FeaturesComponent', () => {
  let component: FuncionalitiesComponent;
  let fixture: ComponentFixture<FuncionalitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionalitiesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FuncionalitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
