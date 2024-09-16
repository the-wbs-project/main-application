import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CheckBoxModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { VisibilitySelectionComponent } from '@wbs/components/_utils/visiblity-selection';

@Component({
  standalone: true,
  selector: 'wbs-title-view',
  templateUrl: './title-view.component.html',
  imports: [
    CheckBoxModule,
    FormsModule,
    TextBoxModule,
    TranslateModule,
    VisibilitySelectionComponent,
  ],
})
export class TitleViewComponent {
  readonly templateTitle = model.required<string>();
  readonly mainTaskTitle = model.required<string>();
  readonly syncTitles = model.required<boolean>();
  readonly visibility = model.required<string>();

  syncTitleChanged(): void {
    this.mainTaskTitle.set(this.templateTitle());
    this.syncTitles.update((x) => !x);
  }
}
