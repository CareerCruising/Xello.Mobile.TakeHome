import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { CollegeDetailsComponent } from '../college-details.component';
import * as CollegeListSelectors from '../../college-list/college-list.selectors';
import * as CollegeListActions from '../../college-list/college-list.actions';
import { College } from '../../college-list/college-list.model';

const mockCollege: College = {
  id: 42,
  name: 'Deep Link University',
  city: 'Boston',
  state: 'MA',
  numStudents: 12000,
  tuitionAndFees: 55000,
  numMajors: 80,
  hasSports: true
};

const initialState = {
  collegeList: { colleges: [], loading: false, error: null }
};

describe('CollegeDetailsComponent', () => {
  let component: CollegeDetailsComponent;
  let fixture: ComponentFixture<CollegeDetailsComponent>;
  let store: MockStore;

  const configureWithId = async (
    id: string,
    colleges: College[] = [mockCollege]
  ) => {
    await TestBed.configureTestingModule({
      imports: [CollegeDetailsComponent, RouterTestingModule],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of({ get: (_: string) => id }) }
        }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(CollegeListSelectors.selectColleges, colleges);
    store.overrideSelector(CollegeListSelectors.selectCollegesLoading, false);
    store.overrideSelector(
      CollegeListSelectors.selectCollegesLoaded,
      colleges.length > 0
    );
  };

  afterEach(() => {
    store?.resetSelectors();
    TestBed.resetTestingModule();
  });

  it('should create', async () => {
    await configureWithId('42');
    fixture = TestBed.createComponent(CollegeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('displays college details when college is in the store', async () => {
    await configureWithId('42');
    fixture = TestBed.createComponent(CollegeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const heading = fixture.debugElement.query(By.css('h2'));
    expect(heading.nativeElement.textContent).toContain('Deep Link University');
  });

  it('shows fallback message when college id is not found', async () => {
    await configureWithId('9999', [mockCollege]);
    fixture = TestBed.createComponent(CollegeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const noCollege = fixture.debugElement.query(By.css('.no-college'));
    expect(noCollege).toBeTruthy();
  });

  it('dispatches loadColleges when store is empty (deep-link / page refresh)', async () => {
    await configureWithId('42', []); // empty store simulates hard refresh
    fixture = TestBed.createComponent(CollegeDetailsComponent);
    component = fixture.componentInstance;

    const dispatchSpy = spyOn(store, 'dispatch');
    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(CollegeListActions.loadColleges());
  });

  it('does NOT dispatch loadColleges when store already has data', async () => {
    await configureWithId('42', [mockCollege]); // pre-populated store
    fixture = TestBed.createComponent(CollegeDetailsComponent);
    component = fixture.componentInstance;

    const dispatchSpy = spyOn(store, 'dispatch');
    fixture.detectChanges();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('navigates to / when back button is clicked', async () => {
    await configureWithId('42');
    fixture = TestBed.createComponent(CollegeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const navigateSpy = spyOn((component as any).router, 'navigate');
    const backBtn = fixture.debugElement.query(By.css('.back-btn'));
    backBtn.nativeElement.click();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('shows Back to List button', async () => {
    await configureWithId('42');
    fixture = TestBed.createComponent(CollegeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('.back-btn'));
    expect(btn).toBeTruthy();
    expect(btn.nativeElement.textContent).toContain('Back to List');
  });
});
