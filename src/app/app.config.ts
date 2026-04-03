import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { collegeListReducer } from './college-list/college-list.reducer';
import { CollegeListEffects } from './college-list/college-list.effects';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // withComponentInputBinding enables route params to be bound as @Input()
    provideRouter(routes, withComponentInputBinding()),
    provideStore({ collegeList: collegeListReducer }),
    provideEffects([CollegeListEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
    provideHttpClient()
    // BUG FIX: CollegeDetailsComponent was incorrectly listed as a provider here.
    // Standalone components should never appear in the providers array.
  ]
};
