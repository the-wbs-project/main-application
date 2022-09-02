import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { TitleService } from '@wbs/shared/services';
import { AuthState } from '@wbs/shared/states';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  @Select(AuthState.name) name$: Observable<string> | undefined;

  constructor(title: TitleService, private readonly router: Router) {
    title.setTitle('Pages.LandingPage', true);
  }
}
