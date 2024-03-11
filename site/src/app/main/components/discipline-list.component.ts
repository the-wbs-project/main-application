import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectCategory } from '@wbs/core/models';
import { DisciplineIconPipe } from '../pipes/discipline-icon.pipe';
import { DisciplineLabelPipe } from '../pipes/discipline-label.pipe';

@Component({
  standalone: true,
  selector: 'wbs-discipline-list',
  template: `@for (disc of selectedList(); track $index) {
    <p class="mb-2 mx-0 tx-14">
      <span class="d-ib wd-20">
        <i class="fa-solid" [ngClass]="disc | disciplineIcon"></i>
      </span>
      <span class="mg-l-5">
        {{ disc | disciplineLabel : fullList() | translate }}
      </span>
    </p>
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DisciplineIconPipe, DisciplineLabelPipe, NgClass, TranslateModule],
})
export class DisciplineListComponent {
  readonly selectedList = input.required<ProjectCategory[]>();
  readonly fullList = input.required<ProjectCategory[]>();
}
