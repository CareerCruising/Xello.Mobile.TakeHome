import * as CollegeListSelectors from './college-list.selectors';

describe('CollegeListSelectors', () => {
  it('should select colleges loading state', () => {
    const state = {
      collegeList: {
        loading: true,
        error: null,
        initialized: false,
        colleges: [],
      },
    };
    expect(CollegeListSelectors.selectCollegesLoading(state)).toBe(true);
  });

  it('should select colleges error state', () => {
    const state = {
      collegeList: {
        loading: false,
        error: 'Error loading colleges',
        initialized: false,
        colleges: [],
      },
    };
    expect(CollegeListSelectors.selectCollegesError(state)).toBe('Error loading colleges');
  });

  it('should select colleges initialized state', () => {
    const state = {
      collegeList: {
        loading: false,
        error: null,
        initialized: true,
        colleges: [],
      },
    };
    expect(CollegeListSelectors.selectCollegesInitialized(state)).toBe(true);
  });

  it('should select colleges list', () => {
    const mockColleges = [
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
    const state = {
      collegeList: {
        loading: false,
        error: null,
        initialized: true,
        colleges: mockColleges,
      },
    };
    expect(CollegeListSelectors.selectColleges(state)).toEqual(mockColleges);
  });
});