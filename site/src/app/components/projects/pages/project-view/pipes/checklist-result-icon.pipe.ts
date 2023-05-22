import { Pipe, PipeTransform } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faCheck,
  faQuestion,
  faWarning,
  faX,
} from '@fortawesome/pro-solid-svg-icons';
import { CHECKLIST_RESULTS, CHECKLIST_RESULTS_TYPE } from '../models';

@Pipe({ name: 'checklistResultIcon' })
export class ChecklistResultIconPipe implements PipeTransform {
  transform(result: CHECKLIST_RESULTS_TYPE): IconDefinition {
    if (result === CHECKLIST_RESULTS.PASS) return faCheck;
    if (result === CHECKLIST_RESULTS.FAIL) return faX;
    if (result === CHECKLIST_RESULTS.WARN) return faWarning;

    return faQuestion;
  }
}
