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
import { UserCardComponent } from '@wbs/components/user-card';
import { DataServiceFactory } from '@wbs/core/data-services';
import { ROLES } from '@wbs/core/models';
import { IdService, SaveService, sorter } from '@wbs/core/services';
import { MetadataStore } from '@wbs/core/store';
import { ProjectViewModel, UserRoleViewModel } from '@wbs/core/view-models';
import { RoleTitlePipe } from '@wbs/pipes/role-title.pipe';
import { switchMap } from 'rxjs';
import { ProjectStore } from '../../../../stores';
import { ContributorDialogComponent } from '../contributor-dialog';

@Component({
  standalone: true,
  selector: 'wbs-project-contributor-card',
  templateUrl: './contributor-card.component.html',
  host: { class: 'card dashboard-card full-item' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    FontAwesomeModule,
    RoleTitlePipe,
    TranslateModule,
    UserCardComponent,
  ],
})
export class ProjectContributorCardComponent {
  private readonly data = inject(DataServiceFactory);
  private readonly dialog = inject(DialogService);
  private readonly metadata = inject(MetadataStore);

  readonly editIcon = faPencil;
  readonly store = inject(ProjectStore);
  readonly saveState = new SaveService();

  readonly contributors = computed(() => {
    const project = this.store.project();

    return project
      ? [
          ...this.getUsers(project, ROLES.PM),
          ...this.getUsers(project, ROLES.APPROVER),
          ...this.getUsers(project, ROLES.SME),
        ]
      : [];
  });

  launchEdit(): void {
    const project = this.store.project()!;

    this.data.memberships
      .getMembershipUsersAsync(project.owner)
      .pipe(
        switchMap((members) =>
          ContributorDialogComponent.launchAsync(this.dialog, true, members)
        )
      )
      .subscribe((x) => {
        if (!x) return;

        //this.saveState
        //  .call(this.service.contributorsChangedAsync(x))
        //  .subscribe();
      });
  }

  private getUsers(
    project: ProjectViewModel,
    role: string
  ): UserRoleViewModel[] {
    const roleId = this.metadata.roles.definitions.find(
      (x) => x.name === role
    )?.id;

    return project.roles
      .filter((x) => x.role === roleId)
      .sort((a, b) => sorter(a.user.fullName, b.user.fullName))
      .map((x) => ({ ...x, trackId: IdService.generate() }));
  }
}
