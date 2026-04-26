import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeTableComponent } from './college-table.component';

describe('CollegeTableComponent', () => {
  let component: CollegeTableComponent;
  let fixture: ComponentFixture<CollegeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollegeTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CollegeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
