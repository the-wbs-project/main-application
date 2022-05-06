import { Component, Input } from '@angular/core';
import { faCircle } from '@fortawesome/pro-duotone-svg-icons';
import { ListItem } from '@wbs/shared/models';

@Component({
  selector: 'wbs-legend-phase',
  templateUrl: './legend-phase.component.html',
  styles: [
    '.icon-wrapper { display: inline-block; width: 50px; }',
    '.legend-header { text-align: center; }',
  ],
})
export class LegendPhaseComponent {
  @Input() idsOrCats: (string | ListItem)[] | null | undefined;
  readonly faCircle = faCircle;
}
