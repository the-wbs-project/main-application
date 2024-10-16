import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from 'src/env';

@Component({
  standalone: true,
  selector: 'wbs-footer',
  template: `<div
    class="bg-white border-top ht-40 w-100 tx-12 pd-t-10 tx-center"
  >
    Copyright © {{ year }}
    <a href="/" class="text-primary">
      {{ title }}
    </a>
    All rights reserved
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  readonly title = environment.appTitle;
  readonly year = new Date().getFullYear();
}
