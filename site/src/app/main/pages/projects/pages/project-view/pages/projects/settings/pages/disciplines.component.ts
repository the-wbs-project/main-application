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
import { DisciplineEditorComponent } from '@wbs/main/components/discipline-editor';
import { DirtyComponent } from '@wbs/main/models';
import { CategorySelectionService } from '@wbs/main/services';
import { MetadataState } from '@wbs/main/states';
import { ChangeProjectCategories } from '../../../../actions';
import { ProjectState, TasksState } from '../../../../states';

@Component({
  standalone: true,
  template: `<div class="card-header tx-medium">
      {{ 'General.Settings' | translate }} >
      {{ 'General.Disciplines' | translate }}
    </div>
    <div class="pd-15">
      @if (categories) {
      <wbs-discipline-editor
        [(categories)]="categories"
        [showSave]="true"
        (saveClicked)="save()"
        (categoriesChange)="isDirty.set(true)"
      />
      }
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DisciplineEditorComponent, TranslateModule],
  providers: [CategorySelectionService],
})
export class ProjectSettingsDisciplinesComponent
  implements OnInit, DirtyComponent
{
  isDirty = signal(false);

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
    const results = this.catService.extract(
      this.categories,
      project.disciplines
    );

    this.store.dispatch(
      new ChangeProjectCategories(PROJECT_NODE_VIEW.DISCIPLINE, results)
    );
    this.isDirty.set(false);
  }

  private rebuild(): void {
    const project = this.store.selectSnapshot(ProjectState.current);

    if (!project) return;

    let counts = new Map<string, number>();
    const nodes = this.store.selectSnapshot(TasksState.nodes)!;

    for (const cat of project.disciplines) {
      const id = typeof cat === 'string' ? cat : cat.id;
      counts.set(id, nodes.filter((x) => x.disciplineIds?.includes(id)).length);
    }

    this.categories = this.catService.build(
      this.store.selectSnapshot(MetadataState.disciplines)!,
      project.disciplines,
      'Projects.DisciplineRemoveConfirm',
      counts
    );
    this.cd.detectChanges();
  }
}
