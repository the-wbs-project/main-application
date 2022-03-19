import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TitleService } from '@app/services';

@Component({
  templateUrl: './component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  constructor(title: TitleService) {
    title.setTitle('Pages.LandingPage', true);
  }
}
