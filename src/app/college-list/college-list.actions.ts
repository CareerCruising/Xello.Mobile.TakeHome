import { createAction, props } from '@ngrx/store';
import { College } from './college-list.model';

export const loadColleges = createAction('[College List] Load Colleges');
export const loadCollegesSuccess = createAction('[College List] Load Colleges Success', props<{ colleges: College[] }>());
export const loadCollegesFailure = createAction('[College List] Load Colleges Failure', props<{ error: any }>());
