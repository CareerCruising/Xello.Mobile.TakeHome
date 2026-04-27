import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterInputComponent } from './filter-input.component';

describe('FilterInputComponent', () => {
  let component: FilterInputComponent;
  let fixture: ComponentFixture<FilterInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilterInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit search event after debounce time', (done) => {
    spyOn(component.search, 'emit');
    component.filter = 'test';
    component.handleInput(null);
    
    setTimeout(() => {
      expect(component.search.emit).toHaveBeenCalledWith('test');
      done();
    }, 300);
  });

  it('should emit search event with value after handleInput', (done) => {
    spyOn(component.search, 'emit');
    component.filter = 'another test';
    component.handleInput(null);
    
    setTimeout(() => {
      expect(component.search.emit).toHaveBeenCalledWith('another test');
      done();
    }, 300);  
  });
  
  it('should clear filter and emit empty string', (done) => {
    spyOn(component.search, 'emit');
    component.filter = 'test';
    component.clearFilter(null);
    
    setTimeout(() => {
      expect(component.filter).toBe('');
      expect(component.search.emit).toHaveBeenCalledWith('');
      done();
    }, 300);  
  });


});
