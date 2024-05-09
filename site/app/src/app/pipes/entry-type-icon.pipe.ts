import { Pipe, PipeTransform } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faChartGantt,
  faDiagramSubtask,
  faQuestion,
  faTasks,
} from '@fortawesome/pro-solid-svg-icons';

@Pipe({ name: 'entryTypeIcon', standalone: true })
export class EntryTypeIconPipe implements PipeTransform {
  transform(type: string): IconDefinition {
    if (type === 'phase') return faDiagramSubtask;
    if (type === 'project') return faChartGantt;
    if (type === 'task') return faTasks;

    return faQuestion;
  }
}
