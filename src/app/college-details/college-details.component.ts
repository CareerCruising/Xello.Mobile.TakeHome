import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { College } from '../college-list/college-list.model';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, map } from 'rxjs';
import * as CollegeListSelectors from '../college-list/college-list.selectors';

@Component({
  selector: 'app-college-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './college-details.component.html',
  styleUrl: './college-details.component.scss'
})
export class CollegeDetailsComponent implements OnInit {
  college$: Observable<College | undefined> = combineLatest([
    this.route.paramMap,
    this.store.select(CollegeListSelectors.selectColleges)
  ]).pipe(
    map(([params, colleges]) => {
      const id = Number(params.get('id'));
      return colleges.find(c => c.id === id);
    })
  );

  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit() {}
}
