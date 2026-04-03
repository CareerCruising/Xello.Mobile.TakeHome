import {
  collegeListReducer,
  CollegeListState,
  initialState
} from '../college-list.reducer';
import * as actions from '../college-list.actions';
import { College } from '../college-list.model';

const mockCollege = (id: number): College => ({
  id,
  name: `College ${id}`,
  city: 'City',
  state: 'TX',
  numStudents: 5000,
  tuitionAndFees: 15000,
  numMajors: 30,
  hasSports: true
});

describe('collegeListReducer', () => {
  it('returns initial state for unknown action', () => {
    const unknownAction = { type: '__UNKNOWN__' } as any;
    const state = collegeListReducer(undefined, unknownAction);
    expect(state).toEqual(initialState);
  });

  it('sets loading=true and clears error on loadColleges', () => {
    const prev: CollegeListState = { ...initialState, error: 'previous error' };
    const state = collegeListReducer(prev, actions.loadColleges());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores colleges and clears loading on loadCollegesSuccess', () => {
    const colleges = [mockCollege(1), mockCollege(2)];
    const prev: CollegeListState = { ...initialState, loading: true };
    const state = collegeListReducer(
      prev,
      actions.loadCollegesSuccess({ colleges })
    );
    expect(state.loading).toBe(false);
    expect(state.colleges).toEqual(colleges);
    expect(state.error).toBeNull();
  });

  it('stores error and clears loading on loadCollegesFailure', () => {
    const prev: CollegeListState = { ...initialState, loading: true };
    const state = collegeListReducer(
      prev,
      actions.loadCollegesFailure({ error: 'oops' })
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('oops');
  });

  it('does not mutate previous state', () => {
    const colleges = [mockCollege(1)];
    const prev: CollegeListState = { ...initialState };
    collegeListReducer(prev, actions.loadCollegesSuccess({ colleges }));
    expect(prev.colleges).toEqual([]);
  });
});
