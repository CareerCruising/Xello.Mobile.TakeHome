import { createReducer, on } from '@ngrx/store';
import * as CollegeListActions from './college-list.actions';
import { College } from './college-list.model';

export interface CollegeListState {
  colleges: College[];
  initialized: boolean;
  loading: boolean;
  error: any;
}

export const initialState: CollegeListState = {
  colleges: [],
  initialized: false,
  loading: false,
  error: null,
};

export const collegeListReducer = createReducer(
  initialState,
  on(CollegeListActions.loadColleges, (state) => ({ ...state, loading: true, error: null })),
  on(CollegeListActions.loadCollegesSuccess, (state, { colleges }) => ({ ...state, colleges, loading: false, initialized: true })),
  on(CollegeListActions.loadCollegesFailure, (state, { error }) => ({ ...state, loading: false, error, initialized: true })),
);
