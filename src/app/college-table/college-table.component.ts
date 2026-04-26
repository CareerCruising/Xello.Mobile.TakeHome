import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { College } from '../store/college-list.model';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { FilterByNamePipe } from '../pipes/filter-by-name.pipe';
import { SortByPipe } from '../pipes/sort-by.pipe';

@Component({
  selector: 'app-college-table',
  standalone: true,
  imports: [CommonModule,ScrollingModule,FilterByNamePipe,SortByPipe],
  templateUrl: './college-table.component.html',
  styleUrl: './college-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollegeTableComponent {

  @Input() data: Array<College> | null = null;

  @Input() filterText:string = '';

  @Output() selectItem = new EventEmitter<College>();

  sortProperty: string = 'id';
  sortOrder: 'asc' | 'desc' = 'asc';

  onHeaderClick(property: string): void {
    if (this.sortProperty === property) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortProperty = property;
      this.sortOrder = 'asc';
    }
  }

  trackById(index: number, item: College):number {
    return item.id // Should just be item.id
  }
}
