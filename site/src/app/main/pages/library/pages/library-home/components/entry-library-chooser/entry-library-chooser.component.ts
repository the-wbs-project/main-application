import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';

@Component({
  standalone: true,
  selector: 'wbs-entry-library-chooser',
  templateUrl: './entry-library-chooser.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonGroupModule, ButtonModule, NgClass, TranslateModule],
})
export class EntryLibraryChooserComponent {
  readonly library = model.required<string>();
}
