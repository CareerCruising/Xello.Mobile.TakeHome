import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { College } from '../college-list/college-list.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import * as CollegeListSelectors from '../college-list/college-list.selectors';
import * as CollegeListActions from '../college-list/college-list.actions';

@Component({
  selector: 'app-college-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './college-details.component.html',
  styleUrl: './college-details.component.scss'
})
export class CollegeDetailsComponent implements OnInit {
  // Deep-linking fix: combineLatest waits for both the route param AND the
  // colleges to be populated. If the store is empty on a hard refresh, ngOnInit
  // dispatches loadColleges so the effect hydrates the store first.
  college$: Observable<College | undefined> = combineLatest([
    this.route.paramMap,
    this.store.select(CollegeListSelectors.selectColleges)
  ]).pipe(
    map(([params, colleges]) => {
      const id = Number(params.get('id'));
      return colleges.find((c) => c.id === id);
    })
  );

  loading$ = this.store.select(CollegeListSelectors.selectCollegesLoading);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    // If navigating directly to /college/:id (e.g., page refresh, shared link),
    // the store will be empty. Dispatch a load only when needed.
    this.store
      .select(CollegeListSelectors.selectCollegesLoaded)
      .pipe(take(1))
      .subscribe((loaded) => {
        if (!loaded) {
          this.store.dispatch(CollegeListActions.loadColleges());
        }
      });
  }

  backToList(): void {
    this.router.navigate(['/']);
  }
}
