import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';

@Component({
  standalone: true,
  selector: 'wbs-tree-type-button',
  templateUrl: './tree-type-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonGroupModule, ButtonModule, TranslateModule],
})
export class TreeTypeButtonComponent {
  readonly view = model.required<'phases' | 'disciplines'>();
}
