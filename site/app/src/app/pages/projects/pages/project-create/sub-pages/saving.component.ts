import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderModule } from '@progress/kendo-angular-indicators';

@Component({
  standalone: true,
  template: `<div class="w-100 text-center pd-t-200">
    <kendo-loader type="infinite-spinner" themeColor="primary" size="large" />
    <br />
    <br />
    <h1>{{ 'General.Saving' | translate }}...</h1>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoaderModule, TranslateModule],
})
export class SavingComponent {}
