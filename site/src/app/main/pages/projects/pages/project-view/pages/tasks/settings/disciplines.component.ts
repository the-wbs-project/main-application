import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { PROJECT_NODE_VIEW } from '@wbs/core/models';
import { CategorySelection } from '@wbs/core/view-models';
import { DisciplineEditorComponent } from '@wbs/main/components/discipline-editor';
import { DirtyComponent } from '@wbs/main/models';
import { CategorySelectionService } from '@wbs/main/services';
import { ChangeTaskDisciplines } from '../../../actions';
import { ProjectState, TasksState } from '../../../states';

@UntilDestroy()
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
export class TaskSettingDisciplineComponent implements DirtyComponent, OnInit {
  readonly isDirty = signal(false);
  categories?: CategorySelection[];

  constructor(
    private readonly catService: CategorySelectionService,
    private readonly cd: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.store
      .select(ProjectState.current)
      .pipe(untilDestroyed(this))
      .subscribe(() => this.rebuild());

    this.route.data.pipe(untilDestroyed(this)).subscribe(() => this.rebuild());
  }

  save(): void {
    const results = this.catService.extractIds(this.categories);

    this.store.dispatch(new ChangeTaskDisciplines(results));
    this.isDirty.set(false);
  }

  private rebuild(): void {
    const project = this.store.selectSnapshot(ProjectState.current);

    if (!project) return;

    const task = this.store.selectSnapshot(TasksState.current);
    const projectCats = project.disciplines;
    const taskCats = task?.disciplines ?? [];

    this.categories = this.catService.buildFromList(
      PROJECT_NODE_VIEW.DISCIPLINE,
      projectCats,
      taskCats
    );
    this.cd.detectChanges();
  }
}
