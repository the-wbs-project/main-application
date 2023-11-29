import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectCategory } from '@wbs/core/models';
import { DisciplineIconPipe } from '@wbs/main/pipes/discipline-icon.pipe';
import { DisciplineLabelPipe } from '@wbs/main/pipes/discipline-label.pipe';

@Component({
  standalone: true,
  selector: 'wbs-discipline-list',
  template: `@for (disc of disciplines; track $index){
    <p class="mb-2 mx-0 tx-14">
      <span class="d-ib wd-20">
        <i class="fa-solid" [ngClass]="disc | disciplineIcon"></i>
      </span>
      <span class="mg-l-5">
        {{ disc | disciplineLabel : projectDisciplines | translate }}
      </span>
    </p>
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DisciplineIconPipe, DisciplineLabelPipe, NgClass, TranslateModule],
})
export class DisciplineListComponent {
  @Input({ required: true }) disciplines?: ProjectCategory[];
  @Input({ required: true }) projectDisciplines!: ProjectCategory[];
}
