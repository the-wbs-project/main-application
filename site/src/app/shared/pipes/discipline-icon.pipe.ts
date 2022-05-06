import { Pipe, PipeTransform } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faQuestion } from '@fortawesome/pro-solid-svg-icons';
import { DISCIPLINE_ICONS } from 'src/environments/icons';
import { ListItem } from '../models';

@Pipe({ name: 'disciplineIcon', pure: false })
export class DisciplineIconPipe implements PipeTransform {
  transform(idsOrCat: (string | ListItem) | null | undefined): IconDefinition {
    return DISCIPLINE_ICONS.find((x) => x.id === idsOrCat)?.icon ?? faQuestion;
  }
}
