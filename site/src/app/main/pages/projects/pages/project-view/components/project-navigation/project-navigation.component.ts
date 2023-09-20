import { NgClass, NgFor, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectRoleFilterPipe } from '../../../../../../pipes/project-role-filter.pipe';
import { ProjectNavigationLink } from '../../models';
import { Store } from '@ngxs/store';

@Component({
  standalone: true,
  selector: 'wbs-project-navigation',
  templateUrl: './project-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    NgFor,
    NgForOf,
    NgIf,
    NgbDropdownModule,
    NgbNavModule,
    ProjectRoleFilterPipe,
    RouterModule,
    TranslateModule,
  ],
})
export class ProjectNavigationComponent {
  @Input({ required: true }) links!: ProjectNavigationLink[];
  @Input({ required: true }) userRoles?: string[];

  constructor(private readonly store: Store) {}

  call(action: any): void {
    this.store.dispatch(action);
  }
}
