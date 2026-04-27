import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { Store } from '@ngrx/store';

import { CollegeDetailsComponent } from './college-details.component';
import * as CollegeListSelectors from '../store/college-list.selectors';
import * as CollegeListActions from '../store/college-list.actions';
import { College } from '../store/college-list.model';

describe('CollegeDetailsComponent', () => {
  let component: CollegeDetailsComponent;
  let fixture: ComponentFixture<CollegeDetailsComponent>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockRouter: jasmine.SpyObj<Router>;
  let paramMap$: BehaviorSubject<any>;

  beforeEach(async () => {
    paramMap$ = new BehaviorSubject(convertToParamMap({ id: '1' }));
    mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

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
      imports: [CollegeDetailsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { paramMap: paramMap$.asObservable() } },
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CollegeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadColleges when not initialized', () => {
    expect(mockStore.dispatch).toHaveBeenCalledWith(CollegeListActions.loadColleges());
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
