import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectNavigationLink } from '../../models';

@Component({
  standalone: true,
  selector: 'wbs-project-navigation',
  templateUrl: './project-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NgbDropdownModule,
    NgbNavModule,
    RouterModule,
    TranslateModule,
  ],
})
export class ProjectNavigationComponent {
  @Input({ required: true }) pageView!: string | null;
  @Input({ required: true }) links!: ProjectNavigationLink[];
}
