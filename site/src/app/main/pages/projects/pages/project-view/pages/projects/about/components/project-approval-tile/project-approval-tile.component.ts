import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircle, faList, faPieChart } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { ProjectApprovalStats } from '@wbs/main/models';
import { ApprovalPieDataPipe } from './approval-pie-data.pipe';

@Component({
  standalone: true,
  selector: 'wbs-project-approval-tile',
  templateUrl: './project-approval-tile.component.html',
  styleUrl: './project-approval-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ApprovalPieDataPipe,
    ChartsModule,
    FontAwesomeModule,
    NgClass,
    TranslateModule,
  ],
})
export class ProjectApprovalTileComponent {
  readonly stats = input.required<ProjectApprovalStats | undefined>();

  readonly faList = faList;
  readonly faCircle = faCircle;
  readonly faPieChart = faPieChart;
  readonly view = signal<'pie' | 'list'>('pie');
}
