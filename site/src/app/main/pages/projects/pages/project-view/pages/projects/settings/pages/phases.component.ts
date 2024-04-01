import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { PROJECT_NODE_VIEW } from '@wbs/core/models';
import { CategorySelection } from '@wbs/core/view-models';
import { PhaseEditorComponent } from '@wbs/main/components/phase-editor';
import { DirtyComponent } from '@wbs/main/models';
import { CategorySelectionService } from '@wbs/main/services';
import { MetadataState } from '@wbs/main/states';
import { ChangeProjectDiscipines } from '../../../../actions';
import { ProjectState, TasksState } from '../../../../states';

@Component({
  standalone: true,
  template: `<div class="card-header tx-medium">
      {{ 'General.Settings' | translate }} >
      {{ 'General.Phases' | translate }}
    </div>
    <div class="pd-15">
      @if (categories) {
      <wbs-phase-editor
        [(categories)]="categories"
        [showSave]="true"
        (saveClicked)="save()"
        (categoriesChange)="isDirty.set(true)"
      />
      }
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PhaseEditorComponent, TranslateModule],
  providers: [CategorySelectionService],
})
export class ProjectSettingsPhasesComponent implements OnInit, DirtyComponent {
  readonly isDirty = signal(false);
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
    const results = this.catService.extract(this.categories, []); // project.phases);

    this.store.dispatch(new ChangeProjectDiscipines(results));
    this.isDirty.set(false);
  }

  private rebuild(): void {
    const project = this.store.selectSnapshot(ProjectState.current);

    if (!project) return;

    let counts = new Map<string, number>();
    const nodes = this.store.selectSnapshot(TasksState.nodes)!;
    /*
    for (const cat of project.phases) {
      const id = typeof cat === 'string' ? cat : cat.id;

      counts.set(id, nodes.filter((x) => x.parentId === id).length);
    }

    this.categories = this.catService.build(
      this.store.selectSnapshot(MetadataState.phases)!,
      project.phases,
      'Projects.PhaseRemoveConfirm',
      counts
    );*/
    this.cd.detectChanges();
  }
}
