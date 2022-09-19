//project-create
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { faSquare, IconDefinition } from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'app-project-title-icon',
  template: ` <fa-stack *ngIf="icon" size="4x">
      <fa-icon [icon]="faSquare" stackItemSize="2x"></fa-icon>
      <fa-icon [icon]="icon" [inverse]="true" stackItemSize="1x"></fa-icon>
    </fa-stack>
    <img
      *ngIf="catWithIcon | categoryIcon; let url"
      [src]="url"
      class="wd-70 h-auto"
    />
    <wbs-edit-pencil
      class="pos-relative t--15"
      placeholder="Projects.EditTaskTitle"
    >
    </wbs-edit-pencil>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleIconComponent {
  @Input() icon?: IconDefinition;
  @Input() catWithIcon?: string;

  readonly faSquare = faSquare;
}
