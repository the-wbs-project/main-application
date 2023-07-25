import { Pipe, PipeTransform } from '@angular/core';
import { CHECKLIST_RESULTS, CHECKLIST_RESULTS_TYPE } from '../models';

@Pipe({ name: 'checklistResultClass', standalone: true })
export class ChecklistResultClassPipe implements PipeTransform {
  transform(result: CHECKLIST_RESULTS_TYPE): string {
    console.log(result);
    if (result === CHECKLIST_RESULTS.PASS) return 'text-success';
    if (result === CHECKLIST_RESULTS.FAIL) return 'text-danger';
    if (result === CHECKLIST_RESULTS.WARN) return 'text-warning';

    return '';
  }
}
