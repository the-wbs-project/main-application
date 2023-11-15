import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from '@angular/core';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { ProjectApprovalStats } from '@wbs/main/models';
import { ApprovalPieDataPipe } from './approval-pie-data.pipe';
import { NgClass } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  faCircle,
  faList,
  faPieChart,
  faTable,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

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
  @Input({ required: true }) stats?: ProjectApprovalStats;

  readonly faList = faList;
  readonly faCircle = faCircle;
  readonly faPieChart = faPieChart;
  readonly view = signal<'pie' | 'list'>('pie');
}
