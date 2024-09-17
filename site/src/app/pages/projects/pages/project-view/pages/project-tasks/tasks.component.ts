import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { HeightDirective } from '@wbs/core/directives/height.directive';
import { WbsPhaseService } from '@wbs/core/services';
import { ProjectDisciplinesTreeComponent } from './components/discipline-tree';
import { ProjectPhaseTreeComponent } from './components/phase-tree';
import { ProjectStore } from '../../stores';

@Component({
  standalone: true,
  templateUrl: './tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WbsPhaseService],
  imports: [
    DialogModule,
    HeightDirective,
    ProjectDisciplinesTreeComponent,
    ProjectPhaseTreeComponent,
    TranslateModule,
  ],
})
export class ProjectTasksComponent {
  readonly projectStore = inject(ProjectStore);

  readonly showDialog = signal(false);
  readonly containerHeight = signal(100);
  readonly dialogContainerHeight = signal(100);
  readonly view = signal<'phases' | 'disciplines'>('phases');
  readonly wbsAbs = signal<'wbs' | 'abs'>('wbs');
}
