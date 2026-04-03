import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CollegeListState } from './college-list.reducer';

export const selectCollegeListState =
  createFeatureSelector<CollegeListState>('collegeList');

export const selectColleges = createSelector(
  selectCollegeListState,
  (state) => state.colleges
);

export const selectCollegesLoading = createSelector(
  selectCollegeListState,
  (state) => state.loading
);

export const selectCollegesError = createSelector(
  selectCollegeListState,
  (state) => state.error
);

/** True once the colleges array has been populated from the API. */
export const selectCollegesLoaded = createSelector(
  selectCollegeListState,
  (state) => state.colleges.length > 0
);
