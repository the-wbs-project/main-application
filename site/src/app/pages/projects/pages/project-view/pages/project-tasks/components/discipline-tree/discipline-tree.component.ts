import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TreeListModule } from '@progress/kendo-angular-treelist';
import {
  TreeButtonsFullscreenComponent,
  TreeButtonsTogglerComponent,
} from '@wbs/components/_utils/tree-buttons';
import { Transformers, TreeService } from '@wbs/core/services';
import { ProjectStore } from '../../../../stores';
import { TreeTypeButtonComponent } from '../tree-type-button';

@Component({
  standalone: true,
  selector: 'wbs-project-discipline-tree',
  templateUrl: './discipline-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule,
    TreeButtonsFullscreenComponent,
    TreeButtonsTogglerComponent,
    TreeListModule,
    TreeTypeButtonComponent,
  ],
})
export class ProjectDisciplinesTreeComponent implements OnInit {
  private readonly store = inject(ProjectStore);
  private readonly transformers = inject(Transformers);
  readonly treeService = new TreeService();
  //
  //  Inputs
  //
  readonly showFullscreen = input.required<boolean>();
  readonly containerHeight = input.required<number>();
  readonly view = model.required<'phases' | 'disciplines'>();
  //
  //  Constaints
  //
  readonly heightOffset = 50;
  readonly rowHeight = 31.5;
  //
  //  signals/models
  //
  readonly taskId = signal<string | undefined>(undefined);
  //
  //  Computed signals
  //
  readonly disciplines = computed(() =>
    this.transformers.nodes.discipline.view.run(
      this.store.project()?.disciplines ?? [],
      this.store.tasks() ?? []
    )
  );
  readonly pageSize = computed(() =>
    this.treeService.pageSize(
      this.containerHeight(),
      this.heightOffset,
      this.rowHeight
    )
  );
  //
  //  Outputs
  //
  readonly navigateToTask = output<string>();
  readonly goFullScreen = output<void>();

  ngOnInit(): void {
    this.treeService.expandedKeys = this.disciplines()
      .filter((x) => !x.parentId)
      .map((x) => x.id);
  }

  nav(): void {
    if (this.taskId()) this.navigateToTask.emit(this.taskId()!);
  }
}
