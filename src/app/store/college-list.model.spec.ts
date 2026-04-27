import { College } from "./college-list.model";

describe('College Model', () => {
  it('should create a college object with all properties', () => {
    const college: College = {
      id: 1,
      name: 'Test College',
      city: 'Test City',
      state: 'Test State',
      numStudents: 1000,
      tuitionAndFees: 20000,
      numMajors: 20,
      hasSports: true,
    };

    expect(college.id).toBe(1);
    expect(college.name).toBe('Test College');
    expect(college.city).toBe('Test City');
    expect(college.state).toBe('Test State');
    expect(college.numStudents).toBe(1000);
    expect(college.tuitionAndFees).toBe(20000);
    expect(college.numMajors).toBe(20);
    expect(college.hasSports).toBe(true);
  });
});