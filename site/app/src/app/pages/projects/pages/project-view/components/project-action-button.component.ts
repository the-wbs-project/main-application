import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { ActionButtonComponent } from '@wbs/components/action-button';
import { ProjectActionButtonService } from '../services';
import { ProjectViewModel } from '@wbs/core/view-models';

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
  readonly project = input.required<ProjectViewModel>();
  readonly approvalEnabled = input.required<boolean>();
  readonly menu = computed(() =>
    this.service.buildMenu(
      this.project(),
      this.claims(),
      this.approvalEnabled()
    )
  );
}
