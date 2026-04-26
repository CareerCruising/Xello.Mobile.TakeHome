import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { College } from '../store/college-list.model';
import * as CollegeListActions from '../store/college-list.actions';
import * as CollegeListSelectors from '../store/college-list.selectors';
import { Router } from '@angular/router';
import { CollegeTableComponent } from '../college-table/college-table.component';
import { FilterInputComponent } from '../filter-input/filter-input.component';

@Component({
  selector: 'app-college-list',
  standalone: true,
  imports: [CommonModule, CollegeTableComponent, FilterInputComponent],
  templateUrl: './college-list.component.html',
  styleUrl: './college-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollegeListComponent implements OnInit, OnDestroy {
  colleges$: Observable<College[]> = this.store.select(CollegeListSelectors.selectColleges);
  loading$: Observable<boolean> = this.store.select(CollegeListSelectors.selectCollegesLoading);
  error$: Observable<any> = this.store.select(CollegeListSelectors.selectCollegesError);

  private destroy$ = new Subject<void>();
  filter = '';

  constructor(private store: Store, private router: Router) {}

  ngOnInit() {
    this.store.select(CollegeListSelectors.selectCollegesInitialized).pipe(
      takeUntil(this.destroy$),
      tap(initialized => {
        if (!initialized) {
          this.store.dispatch(CollegeListActions.loadColleges());
        }
      })
    ).subscribe();
  }

  ngOnDestroy():void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRowClick(college: College):void {
    this.router.navigate(['/college', college.id]);
  }

  performSearch(value:string):void {
    this.filter = value.trim();
  }

  showDetails(college:College):void {
    if(!college) return;
    this.router.navigate(['/college', college.id]);
  }
}
