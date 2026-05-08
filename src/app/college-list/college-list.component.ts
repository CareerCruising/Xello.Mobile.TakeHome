import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { College } from './college-list.model';
import * as CollegeListActions from './college-list.actions';
import * as CollegeListSelectors from './college-list.selectors';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-college-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './college-list.component.html',
  styleUrl: './college-list.component.scss'
})
export class CollegeListComponent {
  colleges$: Observable<College[]> = this.store.select(CollegeListSelectors.selectColleges);
  loading$: Observable<boolean> = this.store.select(CollegeListSelectors.selectCollegesLoading);
  error$: Observable<any> = this.store.select(CollegeListSelectors.selectCollegesError);

  filter = '';

  private _collegesSub = this.colleges$.subscribe();

  constructor(private store: Store, private router: Router) {}

  ngOnInit() {
    setInterval(() => {
      this.store.dispatch(CollegeListActions.loadColleges());
    }, 1000);
  }

  trackById(index: number, item: College) {
    return item.id + Math.random(); // Should just be item.id
  }

  onRowClick(college: College) {
    this.router.navigate(['/college', college.id]);
  }
}
