import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'wbs-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
  readonly appTitle = environment.appTitle;
}
