import { Routes } from '@angular/router';
import { CollegeListComponent } from './college-list/college-list.component';
import { CollegeDetailsComponent } from './college-details/college-details.component';

export const routes: Routes = [
  { path: '', component: CollegeListComponent },
  { path: 'college/:id', component: CollegeDetailsComponent },
];
