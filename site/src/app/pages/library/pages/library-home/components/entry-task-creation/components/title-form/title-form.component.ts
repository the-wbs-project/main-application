import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CheckBoxModule, TextBoxModule } from '@progress/kendo-angular-inputs';

@Component({
  standalone: true,
  selector: 'wbs-title-form',
  templateUrl: './title-form.component.html',
  imports: [CheckBoxModule, FormsModule, TextBoxModule, TranslateModule],
})
export class TitleFormComponent {
  templateTitle = model.required<string>();
  mainTaskTitle = model.required<string>();
  syncTitles = model.required<boolean>();

  syncTitleChanged(): void {
    this.mainTaskTitle.set(this.templateTitle());
    this.syncTitles.update((x) => !x);
  }
}
