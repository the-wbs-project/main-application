import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-tree-type-button',
  templateUrl: './tree-type-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, TranslateModule],
})
export class TreeTypeButtonComponent {
  readonly view = model.required<'phases' | 'disciplines'>();
}
