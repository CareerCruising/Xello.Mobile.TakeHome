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

  it('should set sortProperty and sortOrder on header click', () => {
    component.onHeaderClick('name');
    expect(component.sortProperty).toBe('name');
    expect(component.sortOrder).toBe('asc');

    component.onHeaderClick('name');
    expect(component.sortOrder).toBe('desc');
  });

  it('should track by id', () => {
    const college = { id: 1, name: 'Test College' } as any;
    expect(component.trackById(0, college)).toBe(1);
  });
});
