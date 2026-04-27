import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { CollegeListEffects } from './college-list.effects';
import { loadColleges, loadCollegesSuccess, loadCollegesFailure } from './college-list.actions';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { College } from './college-list.model';

describe('CollegeListEffects', () => {
  let effects: CollegeListEffects;
  let actions$: Observable<any>;
  let httpMock: HttpTestingController;

  const mockColleges: College[] = [
    {
      id: 1,
      name: 'Test College 1',
      city: 'City 1',
      state: 'State 1',
      numStudents: 5000,
      tuitionAndFees: 30000,
      numMajors: 50,
      hasSports: true,
    },
    {
      id: 2,
      name: 'Test College 2',
      city: 'City 2',
      state: 'State 2',
      numStudents: 8000,
      tuitionAndFees: 35000,
      numMajors: 60,
      hasSports: false,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CollegeListEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(CollegeListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('should dispatch loadCollegesSuccess on successful HTTP response', (done) => {
    actions$ = of(loadColleges());

    effects.loadColleges$.subscribe((result) => {
      expect(result).toEqual(loadCollegesSuccess({ colleges: mockColleges }));
      done();
    });

    setTimeout(() => {
      const req = httpMock.expectOne('assets/colleges.json');
      expect(req.request.method).toBe('GET');
      req.flush({ colleges: mockColleges });
    }, 500);
  });

  it('should dispatch loadCollegesFailure on HTTP error', (done) => {
    actions$ = of(loadColleges());

    effects.loadColleges$.subscribe((result) => {
      expect(result.type).toBe(loadCollegesFailure({ error: new Error() }).type);
      done();
    });

    setTimeout(() => {
      const req = httpMock.expectOne('assets/colleges.json');
      req.error(new ErrorEvent('Network error'));
    }, 500);
  });

});
