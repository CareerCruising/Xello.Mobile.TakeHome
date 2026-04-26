import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CollegeListState } from '../store/college-list.reducer';

export const selectCollegeListState = createFeatureSelector<CollegeListState>('collegeList');

export const selectColleges = createSelector(
  selectCollegeListState,
  (state) => state.colleges
);

export const selectCollegeById = (id:number) => createSelector(
  selectColleges,
  (colleges) => colleges.find(c => c.id === id) || null
);

export const selectCollegesLoading = createSelector(
  selectCollegeListState,
  (state) => state.loading
);

export const selectCollegesError = createSelector(
  selectCollegeListState,
  (state) => state.error
);

export const selectCollegesInitialized = createSelector(
  selectCollegeListState,
  (state) => state.initialized
);
