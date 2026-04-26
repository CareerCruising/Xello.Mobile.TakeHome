import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./college-list/college-list.component').then(m => m.CollegeListComponent)
  },
  {
    path: 'college/:id',
    loadComponent: () => import('./college-details/college-details.component').then(m => m.CollegeDetailsComponent)
  },
  { 
    path: '**',
    redirectTo: '' 
  }
];
