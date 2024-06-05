import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { APP_CONFIG_TOKEN, AppConfiguration } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-footer',
  template: `<div
    class="bg-white border-top ht-40 w-100 tx-12 pd-t-10 tx-center"
  >
    Copyright © {{ year }}
    <a href="/" class="text-primary">
      {{ appConfig.app_title }}
    </a>
    All rights reserved
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  readonly appConfig: AppConfiguration = inject(APP_CONFIG_TOKEN);
  readonly year = new Date().getFullYear();
}
