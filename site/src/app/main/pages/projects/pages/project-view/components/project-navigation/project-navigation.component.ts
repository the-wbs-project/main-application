import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { ProjectNavigationLink } from '../../models';

@Component({
  standalone: true,
  selector: 'wbs-project-navigation',
  templateUrl: './project-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CheckPipe,
    NgClass,
    NgbDropdownModule,
    NgbNavModule,
    RouterModule,
    TranslateModule,
  ],
})
export class ProjectNavigationComponent {
  @Input({ required: true }) links!: ProjectNavigationLink[];
  @Input({ required: true }) claims?: string[];

  constructor(readonly store: Store) {}

  call(action: any): void {
    this.store.dispatch(action);
  }
}
