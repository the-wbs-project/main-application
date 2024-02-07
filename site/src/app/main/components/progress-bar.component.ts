import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'wbs-progress-bar',
  template: `<div class="w-100 ht-10 bg-black-2">
    <div class="h-100 bg-success float-left" [style.width.%]="passPercent()">
      &nbsp;
    </div>
    <div class="h-100 bg-danger float-left" [style.width.%]="failPercent()">
      &nbsp;
    </div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent {
  readonly passPercent = input.required<number>();
  readonly failPercent = input.required<number>();
}
