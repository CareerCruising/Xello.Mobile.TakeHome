import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { CollegeListEffects } from '../college-list.effects';
import * as actions from '../college-list.actions';
import { College } from '../college-list.model';

const mockColleges: College[] = [
  {
    id: 1,
    name: 'Test U',
    city: 'Austin',
    state: 'TX',
    numStudents: 5000,
    tuitionAndFees: 20000,
    numMajors: 40,
    hasSports: true
  }
];

describe('CollegeListEffects', () => {
  let effects: CollegeListEffects;
  let actions$: Observable<Action>;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CollegeListEffects, provideMockActions(() => actions$)]
    });

    effects = TestBed.inject(CollegeListEffects);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('dispatches loadCollegesSuccess on successful HTTP response', (done) => {
    actions$ = of(actions.loadColleges());

    effects.loadColleges$.subscribe((result) => {
      expect(result).toEqual(
        actions.loadCollegesSuccess({ colleges: mockColleges })
      );
      done();
    });

    httpController
      .expectOne('assets/colleges.json')
      .flush({ colleges: mockColleges });
  });

  it('dispatches loadCollegesFailure on HTTP error', (done) => {
    actions$ = of(actions.loadColleges());

    effects.loadColleges$.subscribe((result) => {
      expect(result.type).toBe(actions.loadCollegesFailure.type);
      done();
    });

    httpController.expectOne('assets/colleges.json').flush('Server Error', {
      status: 500,
      statusText: 'Internal Server Error'
    });
  });

  it('ignores a second loadColleges while one is in-flight (exhaustMap)', () => {
    // With exhaustMap, a second action whilst the first HTTP call is pending is dropped.
    // We verify only ONE HTTP request was made.
    actions$ = of(actions.loadColleges(), actions.loadColleges());

    const results: Action[] = [];
    effects.loadColleges$.subscribe((r) => results.push(r));

    // Only one pending request should exist
    const reqs = httpController.match('assets/colleges.json');
    expect(reqs.length).toBe(1);
    reqs[0].flush({ colleges: mockColleges });
  });
});
