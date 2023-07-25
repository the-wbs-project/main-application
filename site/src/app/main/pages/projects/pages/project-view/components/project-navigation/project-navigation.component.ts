import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProjectNavigationLink } from '../../models';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'wbs-project-navigation',
  templateUrl: './project-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgbNavModule, RouterModule, TranslateModule]
})
export class ProjectNavigationComponent {
  @Input({ required: true }) pageView!: string | null;
  @Input({ required: true }) links!: ProjectNavigationLink[];
}
