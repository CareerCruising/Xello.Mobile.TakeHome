import { Pipe, PipeTransform } from "@angular/core";
import { College } from "../store/college-list.model";


@Pipe({
    name: 'filterByName',
    standalone: true,
})
export class FilterByNamePipe implements PipeTransform {
    transform(colleges: College[] | null, value: string): College[] {
        if (!colleges) {
            return [];
        }
        if (!value) {
            return colleges;
        }
        return colleges.filter(college => college.name.toLowerCase().includes(value.toLowerCase()));
    }
}