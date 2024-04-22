import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Member, Project, ROLES, SaveState } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { FadingMessageComponent } from '@wbs/main/components/fading-message.component';
import { ProjectRolesComponent } from '@wbs/main/components/project-roles/project-roles.component';
import { MetadataStore } from '@wbs/store';
import { delay, tap } from 'rxjs/operators';
import { AddUserToRole, RemoveUserToRole } from '../../actions';
import { ProjectState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './roles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FadingMessageComponent,
    FontAwesomeModule,
    ProjectRolesComponent,
    TranslateModule,
  ],
})
export class RolesComponent implements OnInit {
  private readonly project = this.store.select(ProjectState.current);
  private readonly roles = inject(MetadataStore).roles.definitions;

  readonly checkIcon = faCheck;
  readonly spinnerIcon = faSpinner;
  readonly isLoading = signal<boolean>(true);
  readonly members = signal<Member[]>([]);
  readonly org = input.required<string>();
  readonly approvalEnabled = input.required<boolean>();
  readonly approverIds = computed(() =>
    this.getIds(ROLES.APPROVER, this.project())
  );
  readonly pmIds = computed(() => this.getIds(ROLES.PM, this.project()));
  readonly smeIds = computed(() => this.getIds(ROLES.SME, this.project()));
  readonly saveState = signal<SaveState>('ready');

  constructor(
    private readonly data: DataServiceFactory,
    private readonly store: SignalStore
  ) {}

  ngOnInit(): void {
    this.data.memberships.getMembershipUsersAsync(this.org()).subscribe((m) => {
      this.members.set(m);
      this.isLoading.set(false);
    });
  }

  add(role: string, user: Member) {
    this.save(new AddUserToRole(role, user));
  }

  remove(role: string, user: Member) {
    this.save(new RemoveUserToRole(role, user));
  }

  private getIds(roleName: string, project: Project | undefined): string[] {
    const role = this.roles.find((r) => r.name === roleName)?.id;
    return (
      project?.roles?.filter((r) => r.role === role).map((r) => r.userId) ?? []
    );
  }

  private save(message: AddUserToRole | RemoveUserToRole): void {
    this.saveState.set('saving');
    this.store
      .dispatch(message)
      .pipe(
        delay(1000),
        tap(() => this.saveState.set('saved')),
        delay(5000)
      )
      .subscribe(() => this.saveState.set('ready'));
  }
}
