import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { PROJECT_NODE_VIEW } from '@wbs/core/models';
import { CategorySelectionService } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { ChangeTaskDisciplines } from '../../../../actions';
import { ProjectState, TasksState } from '../../../../states';
import { CategoryListEditorComponent } from '@wbs/main/components/category-list-editor';

@UntilDestroy()
@Component({
  standalone: true,
  templateUrl: './categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CategoryListEditorComponent]
})
export class TaskSettingsCategoriesComponent implements OnInit {
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
  }

  private rebuild(): void {
    const project = this.store.selectSnapshot(ProjectState.current);
    const task = this.store.selectSnapshot(TasksState.current);

    if (!project) return;

    const projectCats = project.categories.discipline;
    const taskCats = task?.disciplines ?? [];

    this.categories = this.catService.buildFromList(
      PROJECT_NODE_VIEW.DISCIPLINE,
      projectCats,
      taskCats
    );
    this.cd.detectChanges();
  }
}
