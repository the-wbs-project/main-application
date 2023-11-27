import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectCategory } from '@wbs/core/models';
import { CategoryLabelPipe } from '@wbs/main/pipes/category-label.pipe';
import { DisciplineIconPipe } from '@wbs/main/pipes/discipline-icon.pipe';

@Component({
  standalone: true,
  selector: 'wbs-discipline-list',
  template: `@for (disc of disciplines; track $index){
    <p class="mb-2 mx-0 tx-16">
      <span class="d-ib wd-30">
        <i class="fa-solid" [ngClass]="disc | disciplineIcon"></i>
      </span>
      <span class="mg-l-10">
        {{ disc | categoryLabel : projectDisciplines | translate }}
      </span>
    </p>
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CategoryLabelPipe, DisciplineIconPipe, NgClass, TranslateModule],
})
export class DisciplineListComponent {
  @Input({ required: true }) disciplines?: ProjectCategory[];
  @Input({ required: true }) projectDisciplines!: ProjectCategory[];
}
