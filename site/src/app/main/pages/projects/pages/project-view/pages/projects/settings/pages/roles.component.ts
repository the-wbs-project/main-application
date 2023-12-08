import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  computed,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Member, Project, ROLES, Role } from '@wbs/core/models';
import { ProjectRolesComponent } from '@wbs/main/pages/projects/components/project-roles/project-roles.component';
import { RoleState } from '@wbs/main/states';
import { AddUserToRole, RemoveUserToRole } from '../../../../actions';
import { ProjectApprovalState, ProjectState } from '../../../../states';

@Component({
  standalone: true,
  template: `<div class="card-header tx-medium">
      {{ 'General.Settings' | translate }} > {{ 'General.Roles' | translate }}
    </div>
    <div class="pd-15">
      @if (isLoading()) {
      <div class="w-100 tx-center mg-t-50">
        <fa-duotone-icon [icon]="faSpinner" size="5x" [spin]="true" />
        <h3 class="pd-t-20">
          {{ 'General.Loading' | translate }}
        </h3>
      </div>
      } @else {
      <wbs-project-roles
        [members]="members()"
        [approverIds]="approverIds()"
        [pmIds]="pmIds()"
        [smeIds]="smeIds()"
        [mustConfirm]="true"
        [approvalEnabled]="approvalEnabled()!"
        (addUserToRole)="add($event.role, $event.user)"
        (removeUserToRole)="remove($event.role, $event.user)"
      />
      }
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, ProjectRolesComponent, TranslateModule],
})
export class ProjectSettingsRolesComponent implements OnInit {
  @Input() org!: string;

  private readonly project = toSignal(this.store.select(ProjectState.current));
  private readonly roleIds = toSignal(this.store.select(RoleState.definitions));

  readonly faSpinner = faSpinner;
  readonly isLoading = signal<boolean>(true);
  readonly members = signal<Member[]>([]);
  readonly approvalEnabled = toSignal(
    this.store.select(ProjectApprovalState.enabled)
  );
  readonly approverIds = computed(() =>
    this.getUserIds(ROLES.APPROVER, this.roleIds(), this.project())
  );
  readonly pmIds = computed(() =>
    this.getUserIds(ROLES.PM, this.roleIds(), this.project())
  );
  readonly smeIds = computed(() =>
    this.getUserIds(ROLES.SME, this.roleIds(), this.project())
  );

  constructor(
    private readonly data: DataServiceFactory,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.data.memberships.getMembershipUsersAsync(this.org).subscribe((m) => {
      this.members.set(m);
      this.isLoading.set(false);
    });
  }

  add(role: string, user: Member) {
    this.store.dispatch(new AddUserToRole(role, user));
  }

  remove(role: string, user: Member) {
    this.store.dispatch(new RemoveUserToRole(role, user));
  }

  private getUserIds(
    roleName: string,
    roles: Role[] | undefined,
    project: Project | undefined
  ): string[] {
    const role = roles?.find((r) => r.name === roleName)?.id;
    return (
      project?.roles?.filter((r) => r.role === role).map((r) => r.userId) ?? []
    );
  }
}
