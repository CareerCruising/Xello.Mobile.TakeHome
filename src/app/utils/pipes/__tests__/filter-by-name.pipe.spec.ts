import { FilterByNamePipe } from '../filter-by-name.pipe';
import { College } from '../../../college-list/college-list.model';

const makeCollege = (
  partial: Partial<College> & {
    id: number;
    name: string;
    city?: string;
    state?: string;
  }
): College => ({
  city: 'City',
  state: 'NY',
  numStudents: 1000,
  tuitionAndFees: 20000,
  numMajors: 10,
  hasSports: false,
  ...partial
});

describe('FilterByNamePipe', () => {
  let pipe: FilterByNamePipe;
  let colleges: College[];

  beforeEach(() => {
    pipe = new FilterByNamePipe();
    colleges = [
      makeCollege({ id: 1, name: 'MIT', city: 'Cambridge', state: 'MA' }),
      makeCollege({
        id: 2,
        name: 'Harvard University',
        city: 'Cambridge',
        state: 'MA'
      }),
      makeCollege({
        id: 3,
        name: 'Stanford University',
        city: 'Palo Alto',
        state: 'CA'
      }),
      makeCollege({
        id: 4,
        name: 'Yale University',
        city: 'New Haven',
        state: 'CT'
      })
    ];
  });

  it('returns all colleges when filter is empty', () => {
    expect(pipe.transform(colleges, '')).toBe(colleges);
  });

  it('returns all colleges when filter is whitespace only', () => {
    expect(pipe.transform(colleges, '   ')).toBe(colleges);
  });

  it('filters by name case-insensitively', () => {
    const result = pipe.transform(colleges, 'university');
    expect(result.length).toBe(3);
    expect(result.map((c) => c.id)).toEqual([2, 3, 4]);
  });

  it('returns exact name match', () => {
    const result = pipe.transform(colleges, 'MIT');
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(1);
  });

  it('filters by city', () => {
    const result = pipe.transform(colleges, 'palo alto');
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(3);
  });

  it('filters by state', () => {
    // 'CT' only matches Yale's state – unlike 'CA' which is also a substring of 'Cambridge'
    const result = pipe.transform(colleges, 'CT');
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(4);
  });

  it('matches across name and city for same term', () => {
    // "Cambridge" matches city of id 1 and 2
    const result = pipe.transform(colleges, 'cambridge');
    expect(result.length).toBe(2);
    expect(result.map((c) => c.id)).toEqual([1, 2]);
  });

  it('returns empty array when no match', () => {
    expect(pipe.transform(colleges, 'zzznomatch')).toEqual([]);
  });

  it('handles empty college array', () => {
    expect(pipe.transform([], 'anything')).toEqual([]);
  });
});
