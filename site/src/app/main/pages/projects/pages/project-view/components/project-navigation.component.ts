import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
} from '@angular/core';
import { MenuModule } from '@progress/kendo-angular-menu';
import { ProjectNavigationLink } from '../models';

@Component({
  standalone: true,
  selector: 'wbs-project-navigation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MenuModule],
  template: `<nav class="project-nav bg-dark">
    <kendo-menu [items]="menu()" (select)="call($event.item)" />
  </nav> `,
})
export class ProjectNavigationComponent {
  readonly menu = input.required<ProjectNavigationLink[]>();
  @Output() readonly navigate = new EventEmitter<string[]>();

  call(action: ProjectNavigationLink): void {
    if (action.route) this.navigate.emit(action.route);
  }
}
