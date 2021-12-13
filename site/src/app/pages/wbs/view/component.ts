import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { TitleService } from '@app/services';
import { AuthState } from '@app/states';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  @Select(AuthState.name) name$: Observable<string> | undefined;

  constructor(title: TitleService, private readonly router: Router) {
    title.setTitle('Pages.LandingPage', true);
  }
}
