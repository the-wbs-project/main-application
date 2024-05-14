import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProjectCategory } from '@wbs/core/models';
import { DisciplineIconPipe } from '@wbs/pipes/discipline-icon.pipe';
import { DisciplineLabelPipe } from '@wbs/pipes/discipline-label.pipe';

@Component({
  standalone: true,
  selector: 'wbs-discipline-list',
  template: `<ul class="list-group border-0">
    @for (disc of selectedList(); track $index; let odd = $odd) {
    <li
      class="list-group-item pd-y-5 pd-x-0 border-0 bg-transparent"
      [ngClass]="[odd && altClass() ? altClass() : '', itemClass() ?? '']"
    >
      <span class="d-inline-block wd-20 text-center mg-r-10">
        <i class="fa-solid" [ngClass]="disc | disciplineIcon : fullList()"></i>
      </span>
      {{ disc | disciplineLabel : fullList() }}
    </li>
    }
  </ul>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DisciplineIconPipe, DisciplineLabelPipe, NgClass],
})
export class DisciplineListComponent {
  readonly selectedList = input.required<ProjectCategory[]>();
  readonly fullList = input.required<ProjectCategory[]>();
  readonly altClass = input<string>();
  readonly itemClass = input<string>();
}
