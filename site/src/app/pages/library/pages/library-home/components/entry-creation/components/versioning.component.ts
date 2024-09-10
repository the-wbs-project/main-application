import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { AlertComponent } from '@wbs/components/_utils/alert.component';

@Component({
  standalone: true,
  selector: 'wbs-versioning',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AlertComponent, FormsModule, TextBoxModule, TranslateModule],
  host: { class: 'text-start' },
  template: `<wbs-alert
      type="info"
      [dismissible]="false"
      [message]="'LibraryCreate.VersioningHelp' | translate"
    />

    <div class="pd-x-12 mb-3">
      <label for="templateTitle" class="form-label tx-18">
        {{ 'Wbs.VersionAlias' | translate }}
      </label>
      <input kendoTextBox class="w-100" [(ngModel)]="alias" />
    </div>`,
})
export class VersioningComponent {
  readonly alias = model.required<string>();
}
