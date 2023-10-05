import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUpFromBracket } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { gearIcon } from '@progress/kendo-svg-icons';
import { TitleService } from '@wbs/core/services';
import { ActionIconListComponent } from '@wbs/main/components/action-icon-list.component';
import { PageHeaderComponent } from '@wbs/main/components/page-header/page-header.component';
import { FillElementDirective } from '@wbs/main/directives/fill-element.directive';
import { CategoryIconPipe } from '@wbs/main/pipes/category-icon.pipe';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { RolesState } from '@wbs/main/states';
import { ProjectTitleComponent } from '../../components/project-title.component';
import { ProjectActionButtonComponent } from './components/project-action-button/project-action-button.component';
import { ProjectChecklistModalComponent } from './components/project-checklist-modal/project-checklist-modal.component';
import { ProjectNavigationComponent } from './components/project-navigation/project-navigation.component';
import { PROJECT_MENU_ITEMS } from './models';
import { ProjectState } from './states';

@Component({
  standalone: true,
  templateUrl: './project-view-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ActionIconListComponent,
    CategoryIconPipe,
    CheckPipe,
    CommonModule,
    FillElementDirective,
    FontAwesomeModule,
    PageHeaderComponent,
    ProjectChecklistModalComponent,
    ProjectNavigationComponent,
    ProjectTitleComponent,
    RouterModule,
    TranslateModule,
    ProjectActionButtonComponent,
  ],
})
export class ProjectViewLayoutComponent {
  readonly permissions = toSignal(this.store.select(ProjectState.permissions));
  readonly project = toSignal(this.store.select(ProjectState.current));
  readonly roles = toSignal(this.store.select(ProjectState.roles));
  readonly isPm = toSignal(this.store.select(RolesState.isPm));
  readonly category = computed(() => this.project()?.category);
  readonly title = computed(() => this.project()?.title);
  readonly links = PROJECT_MENU_ITEMS.projectLinks;
  readonly faArrowUpFromBracket = faArrowUpFromBracket;
  readonly gearIcon = gearIcon;
  readonly menu = [
    {
      text: 'Projects.SubmitForApproval',
      icon: faArrowUpFromBracket,
      action: 'submitForApproval',
    },
  ];

  constructor(title: TitleService, private readonly store: Store) {
    title.setTitle('Project', false);
  }
}
