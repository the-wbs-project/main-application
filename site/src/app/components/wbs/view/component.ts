import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TitleService } from '@wbs/shared/services';

@Component({
  templateUrl: './component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  constructor(title: TitleService) {
    title.setTitle('Pages.LandingPage', true);
  }
}
