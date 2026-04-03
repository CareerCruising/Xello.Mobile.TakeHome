import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { CollegeListComponent } from '../college-list.component';
import * as CollegeListSelectors from '../college-list.selectors';
import * as CollegeListActions from '../college-list.actions';
import { College } from '../college-list.model';
import { FilterByNamePipe } from '../../utils/pipes/filter-by-name.pipe';

const makeCollege = (id: number, name: string, tuition = 10000): College => ({
  id,
  name,
  city: 'City',
  state: 'TX',
  numStudents: 1000,
  tuitionAndFees: tuition,
  numMajors: 10,
  hasSports: false
});

const initialState = {
  collegeList: {
    colleges: [],
    loading: false,
    error: null
  }
};

describe('CollegeListComponent', () => {
  let component: CollegeListComponent;
  let fixture: ComponentFixture<CollegeListComponent>;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollegeListComponent, RouterTestingModule, FilterByNamePipe],
      providers: [provideMockStore({ initialState }), FilterByNamePipe]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(CollegeListComponent);
    component = fixture.componentInstance;

    // Override selectors to return deterministic data
    store.overrideSelector(CollegeListSelectors.selectColleges, []);
    store.overrideSelector(CollegeListSelectors.selectCollegesLoading, false);
    store.overrideSelector(CollegeListSelectors.selectCollegesError, null);
    store.overrideSelector(CollegeListSelectors.selectCollegesLoaded, false);

    fixture.detectChanges();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('dispatches loadColleges once on init', () => {
    const dispatched = store.scannedActions$;
    const spy = spyOn(store, 'dispatch').and.callThrough();
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith(CollegeListActions.loadColleges());
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('shows loading banner when loading$ is true', () => {
    store.overrideSelector(CollegeListSelectors.selectCollegesLoading, true);
    store.refreshState();
    fixture.detectChanges();
    const loading = fixture.debugElement.query(By.css('.loading'));
    expect(loading).toBeTruthy();
  });

  it('shows error banner when error$ emits', () => {
    store.overrideSelector(
      CollegeListSelectors.selectCollegesError,
      'Network error'
    );
    store.refreshState();
    fixture.detectChanges();
    const error = fixture.debugElement.query(By.css('.error'));
    expect(error).toBeTruthy();
    expect(error.nativeElement.textContent).toContain('Network error');
  });

  it('renders displayedColleges in table rows', () => {
    const colleges = [makeCollege(1, 'MIT'), makeCollege(2, 'Harvard')];
    store.overrideSelector(CollegeListSelectors.selectColleges, colleges);
    store.refreshState();
    fixture.detectChanges();
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(2);
  });

  it('trackById returns the college id', () => {
    const college = makeCollege(42, 'Foo');
    expect(component.trackById(0, college)).toBe(42);
  });

  it('filters colleges by name via filter input', () => {
    const colleges = [
      makeCollege(1, 'MIT'),
      makeCollege(2, 'Harvard University'),
      makeCollege(3, 'Stanford University')
    ];
    store.overrideSelector(CollegeListSelectors.selectColleges, colleges);
    store.refreshState();
    fixture.detectChanges();

    component.filter = 'university';
    component.onFilterChange();
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(2);
  });

  it('sorts ascending then descending on same column', () => {
    const colleges = [
      makeCollege(1, 'Zebra College', 50000),
      makeCollege(2, 'Alpha College', 10000)
    ];
    store.overrideSelector(CollegeListSelectors.selectColleges, colleges);
    store.refreshState();
    fixture.detectChanges();

    component.onSort('tuitionAndFees');
    fixture.detectChanges();
    expect(component.displayedColleges[0].id).toBe(2); // 10000 first

    component.onSort('tuitionAndFees');
    fixture.detectChanges();
    expect(component.displayedColleges[0].id).toBe(1); // 50000 first
  });

  it('navigates to detail page on row click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const college = makeCollege(7, 'Test');
    component.onRowClick(college);
    expect(navigateSpy).toHaveBeenCalledWith(['/college', 7]);
  });

  it('resets to page 0 when filter changes', () => {
    const many: College[] = Array.from({ length: 120 }, (_, i) =>
      makeCollege(i + 1, `College ${i + 1}`)
    );
    store.overrideSelector(CollegeListSelectors.selectColleges, many);
    store.refreshState();
    fixture.detectChanges();

    component.goToPage(1);
    expect(component.currentPage).toBe(1);

    component.filter = 'College 1';
    component.onFilterChange();
    expect(component.currentPage).toBe(0);
  });

  it('getSortIcon returns ⇅ for unsorted column', () => {
    expect(component.getSortIcon('name')).toBe('⇅');
  });

  it('getSortIcon returns ↑ / ↓ for sorted column', () => {
    component.onSort('name');
    expect(component.getSortIcon('name')).toBe('↑');
    component.onSort('name');
    expect(component.getSortIcon('name')).toBe('↓');
  });

  it('paginates to next page correctly (desktop)', () => {
    const many: College[] = Array.from({ length: 110 }, (_, i) =>
      makeCollege(i + 1, `College ${i + 1}`)
    );
    store.overrideSelector(CollegeListSelectors.selectColleges, many);
    store.refreshState();
    fixture.detectChanges();

    expect(component.totalPages).toBe(3);
    expect(component.displayedColleges.length).toBe(50);

    component.goToPage(1);
    expect(component.currentPage).toBe(1);
    expect(component.displayedColleges.length).toBe(50);

    component.goToPage(2);
    expect(component.currentPage).toBe(2);
    expect(component.displayedColleges.length).toBe(10);
  });

  it('does not go beyond totalPages', () => {
    const many: College[] = Array.from({ length: 60 }, (_, i) =>
      makeCollege(i + 1, `College ${i + 1}`)
    );
    store.overrideSelector(CollegeListSelectors.selectColleges, many);
    store.refreshState();
    fixture.detectChanges();

    component.goToPage(1); // valid
    component.goToPage(99); // invalid, clamps
    expect(component.currentPage).toBe(1);
  });

  it('unsubscribes on destroy (no memory leak)', () => {
    const destroyNextSpy = spyOn(
      (component as any).destroy$,
      'next'
    ).and.callThrough();
    component.ngOnDestroy();
    expect(destroyNextSpy).toHaveBeenCalled();
  });
});
