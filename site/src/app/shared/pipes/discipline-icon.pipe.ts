import { Pipe, PipeTransform } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faQuestion } from '@fortawesome/pro-solid-svg-icons';
import { DISCIPLINE_ICONS } from 'src/environments/icons';

@Pipe({ name: 'disciplineIcon', pure: false })
export class DisciplineIconPipe implements PipeTransform {
  transform(id: string | null | undefined): IconDefinition {
    if (!id) return faQuestion;

    return DISCIPLINE_ICONS.find((x) => x.id === id)?.icon ?? faQuestion;
  }
}
