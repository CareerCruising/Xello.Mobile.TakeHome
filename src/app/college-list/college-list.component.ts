import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { College } from './college-list.model';
import * as CollegeListActions from './college-list.actions';
import * as CollegeListSelectors from './college-list.selectors';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FilterByNamePipe } from '../utils/pipes/filter-by-name.pipe';

export type SortColumn = keyof College | '';
export type SortDirection = 'asc' | 'desc';

// TRICKY: The original code had three nasty bugs working together:
// 1. setInterval dispatching loadColleges every 1 s = infinite HTTP spam + store thrash
// 2. _collegesSub subscribed but never unsubscribed = memory leak
// 3. trackById returned `item.id + Math.random()` = unique key every cycle, nuking all
//    **OnPush optimisation and forcing Angular to destroy/recreate every single row.

@Component({
  selector: 'app-college-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterByNamePipe],
  templateUrl: './college-list.component.html',
  styleUrl: './college-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FilterByNamePipe]
})
export class CollegeListComponent implements OnInit, OnDestroy {
  // Store observables (used for loading/error only; colleges managed sync below)
  loading$ = this.store.select(CollegeListSelectors.selectCollegesLoading);
  error$ = this.store.select(CollegeListSelectors.selectCollegesError);

  // Filter
  filter = '';

  // Sort
  sortColumn: SortColumn = '';
  sortDirection: SortDirection = 'asc';

  // Pagination for desktop
  readonly PAGE_SIZE = 50;
  currentPage = 0;
  totalPages = 0;

  // Infinite scroll for mobile
  readonly MOBILE_INIT = 50;
  readonly MOBILE_STEP = 50;
  isMobile = false;
  mobileDisplayedCount = this.MOBILE_INIT;

  // Syncronous data arrays (no async pipe for the list itself = needed for IntersetionObserver)
  private allColleges: College[] = [];
  processedColleges: College[] = [];
  displayedColleges: College[] = [];

  private readonly destroy$ = new Subject<void>();
  private intersectionObserver?: IntersectionObserver;

  // Template ref applied to every <tr> in the list
  @ViewChildren('collegeRow', { read: ElementRef })
  collegeRows!: QueryList<ElementRef>;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly filterPipe: FilterByNamePipe
  ) {}

  // Keep a refe so we can remove the listener on destroy
  private readonly mobileQuery = window.matchMedia('(max-width: 500px)');
  private readonly onMobileQueryChange = (e: MediaQueryListEvent) => {
    this.isMobile = e.matches;
    this.mobileDisplayedCount = this.MOBILE_INIT;
    this.intersectionObserver?.disconnect();
    this.applyProcessing(); // updateDisplayed inside will rescedule the observer
  };

  ngOnInit(): void {
    this.isMobile = this.mobileQuery.matches;
    this.mobileQuery.addEventListener('change', this.onMobileQueryChange);

    // Dispatch only once – the original code called this inside setInterval(fun, 1000)
    this.store.dispatch(CollegeListActions.loadColleges());

    this.store
      .select(CollegeListSelectors.selectColleges)
      .pipe(takeUntil(this.destroy$))
      .subscribe((colleges) => {
        this.allColleges = colleges;
        this.applyProcessing();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.intersectionObserver?.disconnect();
    this.mobileQuery.removeEventListener('change', this.onMobileQueryChange);
  }

  // Filter

  onFilterChange(): void {
    this.currentPage = 0;
    this.mobileDisplayedCount = this.MOBILE_INIT;
    this.applyProcessing();
  }

  // Sort

  onSort(column: SortColumn): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.currentPage = 0;
    this.applyProcessing();
  }

  getSortIcon(column: SortColumn): string {
    if (this.sortColumn !== column) return '⇅';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  // Pagination

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayed();
  }

  // Nav

  onRowClick(college: College): void {
    this.router.navigate(['/college', college.id]);
  }

  // BUG FIX: Was `item.id + Math.random()` —> a new random key every cycle forces
  // Angular to tear down and recreate every DOM row on every change-detection pass.
  trackById(_index: number, item: College): number {
    return item.id;
  }

  // helpers

  private applyProcessing(): void {
    //Filter via the FilterByNamePipe (injected so we can reuse it here and in templates)
    let colleges = this.filterPipe.transform(this.allColleges, this.filter);

    // Sort
    if (this.sortColumn) {
      const col = this.sortColumn;
      const dir = this.sortDirection === 'asc' ? 1 : -1;
      colleges = [...colleges].sort((a, b) => {
        const av = a[col];
        const bv = b[col];
        if (av == null || bv == null) return 0;
        return av < bv ? -dir : av > bv ? dir : 0;
      });
    }

    this.processedColleges = colleges;
    this.totalPages = Math.ceil(colleges.length / this.PAGE_SIZE);
    if (this.currentPage >= this.totalPages) this.currentPage = 0;
    this.updateDisplayed();
  }

  private updateDisplayed(): void {
    if (this.isMobile) {
      this.displayedColleges = this.processedColleges.slice(
        0,
        this.mobileDisplayedCount
      );
    } else {
      const start = this.currentPage * this.PAGE_SIZE;
      this.displayedColleges = this.processedColleges.slice(
        start,
        start + this.PAGE_SIZE
      );
    }
    this.cdr.markForCheck();
    if (this.isMobile) {
      setTimeout(() => this.setupIntersectionObserver(), 0);
    }
  }

  // Observe the 40th row from the top so we pre-load the next batch with a
  // 10 row buffer remaining = gives users a seamless scroll experience.
  private setupIntersectionObserver(): void {
    this.intersectionObserver?.disconnect();

    const rows = this.collegeRows.toArray();
    if (rows.length === 0) return;
    // Nothing left to load = no need for an observer
    if (this.mobileDisplayedCount >= this.processedColleges.length) return;

    // Trigger when the user has scrolled past the 40th row in the current batch
    // (i.e., 10 rows remain as a buffer). Like For 50 rows: index 39.
    const thresholdIndex = Math.min(39, rows.length - 1);
    const target = rows[thresholdIndex]?.nativeElement;
    if (!target) return;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          this.mobileDisplayedCount < this.processedColleges.length
        ) {
          // Disconnect immediately so this observer can"t fire again
          //while Angular is busy re-rendering the new rows.
          this.intersectionObserver?.disconnect();
          this.mobileDisplayedCount += this.MOBILE_STEP;
          this.updateDisplayed(); // schedules next setupIntersectionObserver via setTimeout
        }
      },
      { threshold: 0.1 }
    );

    this.intersectionObserver.observe(target);
  }
}
