import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogService } from '@progress/kendo-angular-dialog';
import { UserInfoComponent } from '@wbs/components/user-info';
import { DataServiceFactory } from '@wbs/core/data-services';
import { SaveService, sorter } from '@wbs/core/services';
import { EntryStore } from '@wbs/core/store';
import { switchMap } from 'rxjs';
import { LibraryService } from '../../../../services';
import { ContributorDialogComponent } from '../contributor-dialog';

@Component({
  standalone: true,
  selector: 'wbs-contributor-card',
  templateUrl: './contributor-card.component.html',
  host: { class: 'card dashboard-card full-item' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    FontAwesomeModule,
    TranslateModule,
    UserInfoComponent,
  ],
})
export class ContributorCardComponent {
  private readonly data = inject(DataServiceFactory);
  private readonly dialog = inject(DialogService);
  private readonly service = inject(LibraryService);

  readonly editIcon = faPencil;
  readonly store = inject(EntryStore);
  readonly saveState = new SaveService();

  readonly contributors = computed(
    () =>
      (this.store.version()!.editors ?? []).sort((a, b) =>
        sorter(a.fullName, b.fullName)
      ) ?? []
  );

  launchEdit(): void {
    const version = this.store.version()!;

    this.data.memberships
      .getMembershipUsersAsync(version.ownerId)
      .pipe(
        switchMap((members) =>
          ContributorDialogComponent.launchAsync(
            this.dialog,
            version.author,
            version.editors,
            members
          )
        )
      )
      .subscribe((x) => {
        if (!x) return;

        this.saveState
          .call(this.service.contributorsChangedAsync(x))
          .subscribe();
      });
  }
}
