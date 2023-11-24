import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { PROJECT_NODE_VIEW } from '@wbs/core/models';
import { CategorySelection } from '@wbs/core/view-models';
import { PhaseListComponent } from '@wbs/main/components/phase-list';
import { DirtyComponent } from '@wbs/main/models';
import { CategorySelectionService } from '@wbs/main/services';
import { ChangeProjectCategories } from '../../../../actions';
import { ProjectState, TasksState } from '../../../../states';

@Component({
  standalone: true,
  template: `<div class="card-header tx-medium">
      {{ 'General.Settings' | translate }} >
      {{ 'General.Phases' | translate }}
    </div>
    <div class="pd-15">
      <wbs-phase-list
        [(categories)]="categories"
        [showSave]="true"
        (saveClicked)="save()"
        (categoriesChange)="isDirty = true"
      />
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PhaseListComponent, TranslateModule],
  providers: [CategorySelectionService],
})
export class ProjectSettingsPhasesComponent implements OnInit, DirtyComponent {
  isDirty = false;
  categories?: CategorySelection[];

  constructor(
    private readonly catService: CategorySelectionService,
    private readonly cd: ChangeDetectorRef,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.rebuild();
  }

  save(): void {
    const project = this.store.selectSnapshot(ProjectState.current)!;
    const results = this.catService.extract(this.categories, project.phases);

    this.store.dispatch(
      new ChangeProjectCategories(PROJECT_NODE_VIEW.PHASE, results)
    );
    this.isDirty = false;
  }

  private rebuild(): void {
    const project = this.store.selectSnapshot(ProjectState.current);

    if (!project) return;

    let counts = new Map<string, number>();
    const nodes = this.store.selectSnapshot(TasksState.nodes)!;

    for (const cat of project.phases) {
      const id = typeof cat === 'string' ? cat : cat.id;

      counts.set(id, nodes.filter((x) => x.parentId === id).length);
    }

    this.categories = this.catService.build(
      PROJECT_NODE_VIEW.PHASE,
      project.phases,
      'Projects.PhaseRemoveConfirm',
      counts
    );
    this.cd.detectChanges();
  }
}
