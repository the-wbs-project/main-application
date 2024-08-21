import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { UserInfoComponent } from '@wbs/components/user-info';
import { SaveService, sorter } from '@wbs/core/services';
import { EntryService } from '@wbs/core/services/library';
import { LibraryVersionViewModel, UserViewModel } from '@wbs/core/view-models';
import { ContributorDialogComponent } from '../contributor-dialog';
import { DataServiceFactory } from '@wbs/core/data-services';
import { switchMap } from 'rxjs';
import { ButtonModule } from '@progress/kendo-angular-buttons';

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
  private readonly service = inject(EntryService);

  readonly editIcon = faPencil;
  readonly saveState = new SaveService();

  readonly canEdit = input.required<boolean>();
  readonly version = input.required<LibraryVersionViewModel>();
  readonly contributors = computed(
    () =>
      (this.version()!.editors ?? []).sort((a, b) =>
        sorter(a.fullName, b.fullName)
      ) ?? []
  );

  launchEdit(): void {
    const version = this.version()!;

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
