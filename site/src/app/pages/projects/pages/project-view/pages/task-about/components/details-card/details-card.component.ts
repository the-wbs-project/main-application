import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { OrganizationService } from '@wbs/core/services';
import { ProjectViewModel, TaskViewModel } from '@wbs/core/view-models';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';

@Component({
  standalone: true,
  selector: 'wbs-task-details-card',
  templateUrl: './details-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DateTextPipe, RouterModule, TranslateModule],
})
export class DetailsCardComponent implements OnInit {
  private readonly orgService = inject(OrganizationService);

  readonly project = input.required<ProjectViewModel>();
  readonly task = input.required<TaskViewModel>();
  readonly owner = signal('');

  ngOnInit(): void {
    this.orgService
      .getNameAsync(this.project().owner)
      .subscribe((name) => this.owner.set(name ?? ''));
  }
}
