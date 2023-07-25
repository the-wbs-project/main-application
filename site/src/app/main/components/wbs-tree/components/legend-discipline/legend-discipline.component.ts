import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Select } from '@ngxs/store';
import { ListItem } from '@wbs/core/models';
import { MetadataState } from '@wbs/core/states';
import { CategoryLabelPipe } from '@wbs/main/pipes/category-label.pipe';
import { DisciplineIconPipe } from '@wbs/main/pipes/discipline-icon.pipe';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'wbs-legend-discipline',
  templateUrl: './legend-discipline.component.html',
  styles: [
    '.icon-wrapper { display: inline-block; width: 50px; }',
    '.legend-header { text-align: center; }',
  ],
  imports: [CategoryLabelPipe, CommonModule, DisciplineIconPipe]
})
export class LegendDisciplineComponent {
  @Input() idsOrCats: (string | ListItem)[] | null | undefined;
  @Select(MetadataState.disciplineCategories) categories$:
    | Observable<ListItem[]>
    | undefined;
}
