import { Pipe, PipeTransform } from '@angular/core';
import { College } from '../../college-list/college-list.model';

/**
 * Pipe to filters colleges by name, city, or state.
 * Case-insensitive substring match across all three fields.
 * when empty  = returns the original array
 */
@Pipe({
  name: 'filterByName',
  standalone: true,
  pure: true
})
export class FilterByNamePipe implements PipeTransform {
  transform(colleges: College[], filter: string): College[] {
    if (!filter?.trim()) return colleges;
    const lower = filter.toLowerCase();
    return colleges.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.city.toLowerCase().includes(lower) ||
        c.state.toLowerCase().includes(lower)
    );
  }
}
