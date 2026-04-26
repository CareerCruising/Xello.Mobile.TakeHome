import { Pipe, PipeTransform } from "@angular/core";
import { College } from "../store/college-list.model";


@Pipe({
    name: 'sortBy',
    standalone: true,
})
export class SortByPipe implements PipeTransform {
    transform(colleges: College[] | null, property: string, order: 'asc' | 'desc'): College[] {
        if (!colleges) {
            return [];
        }
        return [...(colleges as any)].sort((a:any, b:any) => {
            if (a[property] < b[property]) {
                return order === 'asc' ? -1 : 1;
            }
            if (a[property] > b[property]) {
                return order === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }
}