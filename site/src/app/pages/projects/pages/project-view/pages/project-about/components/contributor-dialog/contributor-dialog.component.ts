import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  DialogCloseResult,
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { SaveMessageComponent } from '@wbs/components/_utils/save-message.component';
import { ProjectRolesComponent } from '@wbs/components/project-roles';
import { ROLES, User } from '@wbs/core/models';
import { SaveService } from '@wbs/core/services';
import { ProjectViewModel } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectService } from '../../../../services';
import { ProjectStore } from '../../../../stores';

@Component({
  standalone: true,
  templateUrl: './contributor-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DialogModule,
    ProjectRolesComponent,
    SaveMessageComponent,
    TranslateModule,
  ],
})
export class ContributorDialogComponent extends DialogContentBase {
  private readonly service = inject(ProjectService);
  private readonly project = inject(ProjectStore).project;

  readonly members = signal<User[]>([]);
  readonly approvalEnabled = signal(false);
  readonly saving = new SaveService();
  //
  //  Computed
  //
  readonly approvers = computed(() =>
    this.getUsers(ROLES.APPROVER, this.project())
  );
  readonly pms = computed(() => this.getUsers(ROLES.PM, this.project()));
  readonly smes = computed(() => this.getUsers(ROLES.SME, this.project()));

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  static launchAsync(
    dialog: DialogService,
    approvalEnabled: boolean,
    members: User[]
  ): Observable<User[] | undefined> {
    const ref = dialog.open({
      content: ContributorDialogComponent,
    });
    const comp = ref.content.instance as ContributorDialogComponent;

    comp.approvalEnabled.set(approvalEnabled);
    comp.members.set(members);

    return ref.result.pipe(
      map((x: unknown) => (x instanceof DialogCloseResult ? undefined : <any>x))
    );
  }

  add(role: string, user: User) {
    this.saving.call(this.service.addUserToRole(role, user)).subscribe();
  }

  remove(role: string, user: User) {
    this.saving.call(this.service.removeUserFromRole(role, user)).subscribe();
  }

  private getUsers(
    role: string,
    project: ProjectViewModel | undefined
  ): User[] {
    return (project?.roles ?? [])
      .filter((r) => r.role === role)
      .map((r) => r.user);
  }
}
