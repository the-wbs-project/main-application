import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';

@Component({
  standalone: true,
  selector: 'wbs-library-selector',
  templateUrl: './library-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonGroupModule, ButtonModule, NgClass, TranslateModule],
})
export class LibrarySelectorComponent {
  readonly library = model.required<string>();
}
