import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadColleges, loadCollegesSuccess, loadCollegesFailure } from './college-list.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { College } from './college-list.model';

@Injectable()
export class CollegeListEffects {
  loadColleges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadColleges),
      mergeMap(() =>
        this.http.get<{ colleges: College[] }>('assets/colleges.json').pipe(
          map(response => loadCollegesSuccess({ colleges: response.colleges })),
          catchError(error => of(loadCollegesFailure({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
