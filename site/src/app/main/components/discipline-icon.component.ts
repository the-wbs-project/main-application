import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DisciplineIconPipe } from '@wbs/main/pipes/discipline-icon.pipe';
import { DisciplineLabelPipe } from '@wbs/main/pipes/discipline-label.pipe';

@Component({
  standalone: true,
  selector: 'wbs-discipline-icon',
  template: `<span
    class="mg-r-5"
    [ngbTooltip]="id() | disciplineLabel | translate"
    placement="top"
    container="body"
  >
    <i class="fa-solid fa-sm" [ngClass]="[id() | disciplineIcon]"></i>
  </span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DisciplineIconPipe,
    DisciplineLabelPipe,
    NgbTooltipModule,
    NgClass,
    TranslateModule,
  ],
})
export class DisciplineIconComponent {
  readonly id = input.required<string>();
}
