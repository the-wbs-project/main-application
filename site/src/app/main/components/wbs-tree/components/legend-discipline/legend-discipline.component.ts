import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Select } from '@ngxs/store';
import { ListItem } from '@wbs/core/models';
import { CategoryLabelPipe } from '@wbs/main/pipes/category-label.pipe';
import { DisciplineIconPipe } from '@wbs/main/pipes/discipline-icon.pipe';
import { MetadataState } from '@wbs/main/states';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'wbs-legend-discipline',
  templateUrl: './legend-discipline.component.html',
  styles: [
    '.icon-wrapper { display: inline-block; width: 50px; }',
    '.legend-header { text-align: center; }',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CategoryLabelPipe,
    CommonModule,
    DisciplineIconPipe,
    TranslateModule,
  ],
})
export class LegendDisciplineComponent {
  @Input() idsOrCats: (string | ListItem)[] | null | undefined;
  @Select(MetadataState.disciplines) categories$:
    | Observable<ListItem[]>
    | undefined;
}
