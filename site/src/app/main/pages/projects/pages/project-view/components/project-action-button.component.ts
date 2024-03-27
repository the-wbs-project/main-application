import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { Project } from '@wbs/core/models';
import { ActionButtonComponent } from '@wbs/main/components/action-button';
import { ProjectActionButtonService } from '../services';

@Component({
  standalone: true,
  selector: 'wbs-project-action-button',
  template: `<wbs-action-button
    [menu]="menu()"
    (itemClicked)="service.handleAction($event, approvalEnabled())"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActionButtonComponent],
  providers: [ProjectActionButtonService],
})
export class ProjectActionButtonComponent {
  readonly service = inject(ProjectActionButtonService);

  readonly claims = input.required<string[]>();
  readonly project = input.required<Project>();
  readonly approvalEnabled = input.required<boolean>();
  readonly menu = computed(() =>
    this.service.buildMenu(
      this.project(),
      this.claims(),
      this.approvalEnabled()
    )
  );
}
