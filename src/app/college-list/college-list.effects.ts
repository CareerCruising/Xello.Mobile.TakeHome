import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  loadColleges,
  loadCollegesSuccess,
  loadCollegesFailure
} from './college-list.actions';
// 1 chage on this file = exhaustMap: if another loadColleges fires while a request is in-flight, it is ignored.
// This prevents duplicate HTTP requests (e.g., the old setInterval bug re-entry).
import { catchError, exhaustMap, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { College } from './college-list.model';

@Injectable()
export class CollegeListEffects {
  loadColleges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadColleges),
      exhaustMap(() =>
        this.http.get<{ colleges: College[] }>('assets/colleges.json').pipe(
          map((response) =>
            loadCollegesSuccess({ colleges: response.colleges })
          ),
          catchError((error) => of(loadCollegesFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}
}
