import { loadColleges, loadCollegesFailure, loadCollegesSuccess } from "./college-list.actions";
import { College } from "./college-list.model";
import { collegeListReducer, initialState } from "./college-list.reducer";

describe('CollegeListReducer', () => {

  it('should set loading to true on loadColleges', () => {
    const action = loadColleges();
    const result = collegeListReducer(initialState, action);
    expect(result.loading).toBeTrue();
    expect(result.error).toBeNull();
  });

  it('should set colleges and loading to false on loadCollegesSuccess', () => {
    const mockColleges: College[] = [
      {
        id: 1,
        name: 'Test College',
        city: 'Test City',
        state: 'Test State',
        numStudents: 1000,
        tuitionAndFees: 20000,
        numMajors: 20,
        hasSports: true,
      },
    ];
    const action = loadCollegesSuccess({ colleges: mockColleges });
    const result = collegeListReducer({ ...initialState, loading: true }, action);
    expect(result.loading).toBeFalse();
    expect(result.colleges).toEqual(mockColleges);
  });

  it('should set error and loading to false on loadCollegesFailure', () => {
    const error = new Error('Failed to load colleges');
    const action = loadCollegesFailure({ error });
    const result = collegeListReducer({ ...initialState, loading: true }, action);
    expect(result.loading).toBeFalse();
    expect(result.error).toEqual(error);
  });
});