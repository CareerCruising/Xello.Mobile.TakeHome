import { createReducer, on } from '@ngrx/store';
import * as CollegeListActions from './college-list.actions';
import { College } from './college-list.model';

export interface CollegeListState {
  colleges: College[];
  loading: boolean;
  error: any;
}

export const initialState: CollegeListState = {
  colleges: [],
  loading: false,
  error: null,
};

export const collegeListReducer = createReducer(
  initialState,
  on(CollegeListActions.loadColleges, (state) => ({ ...state, loading: true, error: null })),
  on(CollegeListActions.loadCollegesSuccess, (state, { colleges }) => ({ ...state, colleges, loading: false })),
  on(CollegeListActions.loadCollegesFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
