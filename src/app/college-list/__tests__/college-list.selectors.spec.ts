import {
  selectColleges,
  selectCollegesLoading,
  selectCollegesError,
  selectCollegesLoaded
} from '../college-list.selectors';
import { CollegeListState } from '../college-list.reducer';
import { College } from '../college-list.model';

const college = (id: number): College => ({
  id,
  name: `College ${id}`,
  city: 'City',
  state: 'TX',
  numStudents: 1000,
  tuitionAndFees: 10000,
  numMajors: 10,
  hasSports: false
});

const buildState = (slice: Partial<CollegeListState>) => ({
  collegeList: {
    colleges: [],
    loading: false,
    error: null,
    ...slice
  } as CollegeListState
});

describe('CollegeList Selectors', () => {
  describe('selectColleges', () => {
    it('returns the colleges array', () => {
      const colleges = [college(1), college(2)];
      expect(selectColleges(buildState({ colleges }))).toEqual(colleges);
    });

    it('returns empty array by default', () => {
      expect(selectColleges(buildState({}))).toEqual([]);
    });
  });

  describe('selectCollegesLoading', () => {
    it('returns true when loading', () => {
      expect(selectCollegesLoading(buildState({ loading: true }))).toBe(true);
    });

    it('returns false when not loading', () => {
      expect(selectCollegesLoading(buildState({ loading: false }))).toBe(false);
    });
  });

  describe('selectCollegesError', () => {
    it('returns the error', () => {
      expect(selectCollegesError(buildState({ error: 'boom' }))).toBe('boom');
    });

    it('returns null when no error', () => {
      expect(selectCollegesError(buildState({}))).toBeNull();
    });
  });

  describe('selectCollegesLoaded', () => {
    it('returns true when colleges array is non-empty', () => {
      expect(selectCollegesLoaded(buildState({ colleges: [college(1)] }))).toBe(
        true
      );
    });

    it('returns false when colleges array is empty', () => {
      expect(selectCollegesLoaded(buildState({ colleges: [] }))).toBe(false);
    });
  });
});
