import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { VisibilitySelectionComponent } from '@wbs/components/_utils/visiblity-selection';

@Component({
  standalone: true,
  selector: 'wbs-info-view',
  templateUrl: './info-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    TextBoxModule,
    TranslateModule,
    VisibilitySelectionComponent,
  ],
})
export class InfoViewComponent {
  readonly templateTitle = model.required<string>();
  readonly visibility = model.required<'public' | 'private'>();
}
