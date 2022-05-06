import { Component, Input } from '@angular/core';
import { Select } from '@ngxs/store';
import { ListItem } from '@wbs/shared/models';
import { MetadataState } from '@wbs/shared/states';
import { Observable } from 'rxjs';

@Component({
  selector: 'wbs-legend-discipline',
  templateUrl: './legend-discipline.component.html',
  styles: [
    '.icon-wrapper { display: inline-block; width: 50px; }',
    '.legend-header { text-align: center; }',
  ],
})
export class LegendDisciplineComponent {
  @Input() idsOrCats: (string | ListItem)[] | null | undefined;
  @Select(MetadataState.disciplineCategories) categories$:
    | Observable<ListItem[]>
    | undefined;
}
