import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { College } from '../store/college-list.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, map, switchMap, takeUntil, tap } from 'rxjs';
import * as CollegeListSelectors from '../store/college-list.selectors';
import * as CollegeListActions from '../store/college-list.actions';

@Component({
  selector: 'app-college-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './college-details.component.html',
  styleUrl: './college-details.component.scss'
})
export class CollegeDetailsComponent implements OnInit, OnDestroy {
  college$: Observable<College | null>;
  loading$: Observable<boolean>;
  error$: Observable<any>;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute, 
    private store: Store,
    private router: Router
  ) {
    this.loading$ = this.store.select(CollegeListSelectors.selectCollegesLoading);
    this.error$ = this.store.select(CollegeListSelectors.selectCollegesError);
    this.college$ = this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      map(params => Number(params.get('id'))),
      switchMap(id => this.store.select(CollegeListSelectors.selectCollegeById(id)))
    );
  }

  ngOnInit():void {
    this.store.select(CollegeListSelectors.selectCollegesInitialized).pipe(
      takeUntil(this.destroy$),
      tap(initialized => {
        if (!initialized) {
          this.store.dispatch(CollegeListActions.loadColleges());
        }
      })
    ).subscribe();
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  ngOnDestroy():void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
