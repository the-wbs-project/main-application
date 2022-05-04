import { Component, Input } from '@angular/core';
import { faCircle } from '@fortawesome/pro-duotone-svg-icons';

@Component({
  selector: 'wbs-legend-phase',
  templateUrl: './legend-phase.component.html',
  styles: [
    '.icon-wrapper { display: inline-block; width: 50px; }',
    '.legend-header { text-align: center; }',
  ],
})
export class LegendPhaseComponent {
  @Input() ids: string[] | undefined;
  readonly faCircle = faCircle;
}
