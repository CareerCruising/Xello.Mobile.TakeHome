import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-filter-input',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './filter-input.component.html',
  styleUrl: './filter-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterInputComponent implements OnInit, OnDestroy {

  @Output() search = new EventEmitter<string>();

  filter:string = '';

  private filterSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.filterSubject.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.search.emit(value);
    });
  }

  handleInput(event: any): void {
    this.filterSubject.next(this.filter);
  }

  clearFilter(event: any): void {
    this.filter = '';
    this.filterSubject.next(this.filter);
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
