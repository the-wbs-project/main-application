//project-create
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { faSquare, IconDefinition } from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'app-project-title-icon',
  template: ` <fa-stack *ngIf="icon" size="4x">
    <fa-icon [icon]="faSquare" stackItemSize="2x"></fa-icon>
    <fa-icon [icon]="icon" [inverse]="true" stackItemSize="1x"> </fa-icon>
  </fa-stack>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleIconComponent {
  @Input() icon?: IconDefinition;
  readonly faSquare = faSquare;
}
