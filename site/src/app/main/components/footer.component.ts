import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  standalone: true,
  selector: 'wbs-footer',
  template: `<div class="main-footer">
  <div class="container-fluid pd-t-0-f ht-100p">
    Copyright © {{ year }}
    <a href="/" class="text-primary">
      {{ appTitle }}
    </a>
    All rights reserved
  </div>
</div>`
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
  readonly appTitle = environment.appTitle;
}
