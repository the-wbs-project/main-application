import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'wbs-project-statistic',
  template: `<div class="card border p-2 bg-light wd-150 mg-x-10 d-ib">
    <div class="tx-center">
      <span class="d-block tx-36"> {{ stat }} </span>
      {{ label }}
    </div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectStatisticComponent {
  @Input() stat?: number;
  @Input() label?: string;
}
