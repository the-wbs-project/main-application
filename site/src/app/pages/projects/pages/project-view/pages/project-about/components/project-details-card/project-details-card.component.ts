import { AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UserComponent } from '@wbs/components/user';
import { MetadataStore } from '@wbs/core/store';
import { ProjectTaskViewModel, ProjectViewModel } from '@wbs/core/view-models';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';
import { ProjectCategoryLabelPipe } from '@wbs/pipes/project-category-label.pipe';
import { UserNamePipe } from '@wbs/pipes/user-name.pipe';

@Component({
  standalone: true,
  selector: 'wbs-project-details-card',
  templateUrl: './project-details-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'card dashboard-card' },
  imports: [
    AsyncPipe,
    DateTextPipe,
    NgClass,
    ProjectCategoryLabelPipe,
    TranslateModule,
    UserComponent,
    UserNamePipe,
  ],
})
export class ProjectDetailsCardComponent {
  private roleIds = inject(MetadataStore).roles.ids;

  readonly project = input.required<ProjectViewModel>();
  readonly tasks = input.required<ProjectTaskViewModel[]>();
  readonly pms = computed(() => this.getUsers(this.project(), this.roleIds.pm));
  readonly approvers = computed(() =>
    this.getUsers(this.project(), this.roleIds.approver)
  );
  readonly smes = computed(() =>
    this.getUsers(this.project(), this.roleIds.sme)
  );

  private getUsers(project: ProjectViewModel, role: string): string[] {
    return project.roles
      .filter((x) => x.role === role)
      .map((x) => x.user.userId);
  }
}
