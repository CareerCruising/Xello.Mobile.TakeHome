import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeListComponent } from './college-list.component';
import { Store } from '@ngrx/store';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { College } from '../store/college-list.model';
import * as CollegeListSelectors from '../store/college-list.selectors';
import * as CollegeListActions from '../store/college-list.actions';

describe('CollegeListComponent', () => {
  let component: CollegeListComponent;
  let fixture: ComponentFixture<CollegeListComponent>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockRouter: jasmine.SpyObj<Router>;
  let paramMap$: BehaviorSubject<any>;

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj<Store>('Store', ['select', 'dispatch']);
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);
    paramMap$ = new BehaviorSubject(convertToParamMap({ id: '1' }));
    mockStore.select.and.callFake((selector: any) => {
      if (selector === CollegeListSelectors.selectCollegesLoading) {
        return of(false);
      }
      if (selector === CollegeListSelectors.selectCollegesError) {
        return of(null);
      }
      if (selector === CollegeListSelectors.selectCollegesInitialized) {
        return of(false);
      }
      return of({
        id: 1,
        name: 'Test College',
        city: 'Test City',
        state: 'Test State',
        numStudents: 1000,
        tuitionAndFees: 20000,
        numMajors: 10,
        hasSports: true,
      } as College);
    });

    await TestBed.configureTestingModule({
      imports: [CollegeListComponent],
      providers: [
        {provide: ActivatedRoute, useValue: { paramMap: paramMap$.asObservable() } },
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
    
    fixture = TestBed.createComponent(CollegeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadColleges when not initialized', () => {
    expect(mockStore.dispatch).toHaveBeenCalledWith(CollegeListActions.loadColleges());
  });

  it('should navigate to college details on showDetails call', () => {
    const college: College = {
      id: 1,
      name: 'Test College',
      city: 'Test City',
      state: 'Test State',
      numStudents: 1000,
      tuitionAndFees: 20000,
      numMajors: 10,
      hasSports: true,
    };
    component.showDetails(college);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/college', college.id]);
  });

  it('should update filter on performSearch', () => {
    const searchValue = 'Test Search';
    component.performSearch(searchValue);
    expect(component.filter).toBe(searchValue.trim());
  });
});
