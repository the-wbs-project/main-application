import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { BehaviorSubject, map } from 'rxjs';

const INFO_PAGES: Record<string, string[]> = {
  'page-not-found': ['Info.PageNotFound', 'Info.PageNotFoundDescription'],
  'invite-not-found': ['Info.InviteNotFound', 'Info.InviteNotFoundDescription'],
  'invite-cancelled': [
    'Info.InviteCancelled',
    'Info.InviteCancelledDescription',
  ],
};

@UntilDestroy()
@Component({
  standalone: true,
  templateUrl: './info.component.html',
  imports: [CommonModule, TranslateModule],
})
export class InfoComponent implements OnInit {
  readonly name$ = new BehaviorSubject<string | undefined>(undefined);
  readonly description$ = new BehaviorSubject<string | undefined>(undefined);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((x) => x['message']),
        untilDestroyed(this)
      )
      .subscribe((message) => {
        const resources = INFO_PAGES[message];

        if (resources) {
          this.name$.next(resources[0]);
          this.description$.next(resources[1]);
        } else {
          this.store.dispatch(new Navigate(['/info', 'page-not-found']));
        }
      });
  }
}
