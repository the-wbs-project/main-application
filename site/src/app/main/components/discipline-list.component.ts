import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectCategory } from '@wbs/core/models';
import { DisciplineIconPipe } from '../pipes/discipline-icon.pipe';
import { DisciplineLabelPipe } from '../pipes/discipline-label.pipe';

@Component({
  standalone: true,
  selector: 'wbs-discipline-list',
  template: `<ul class="list-group border-0">
    @for (disc of selectedList(); track $index; let odd = $odd) {
    <li
      class="list-group-item pd-y-5 pd-x-0 border-0"
      [ngClass]="[odd && altClass() ? altClass() : '', itemClass() ?? '']"
    >
      <span class="d-ib wd-30">
        <i class="fa-solid" [ngClass]="disc | disciplineIcon"></i>
      </span>
      {{ disc | disciplineLabel : fullList() | translate }}
    </li>
    }
  </ul>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DisciplineIconPipe, DisciplineLabelPipe, NgClass, TranslateModule],
})
export class DisciplineListComponent {
  readonly selectedList = input.required<ProjectCategory[]>();
  readonly fullList = input.required<ProjectCategory[]>();
  readonly altClass = input<string>();
  readonly itemClass = input<string>();
}
