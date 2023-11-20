import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import {
  PROJECT_NODE_VIEW,
  PROJECT_NODE_VIEW_TYPE,
  ProjectCategory,
} from '@wbs/core/models';
import { CategorySelection } from '@wbs/core/view-models';
import { CategoryListEditorComponent } from '@wbs/main/components/category-list-editor';
import { CategorySelectionService } from '@wbs/main/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChangeProjectCategories } from '../../../../../actions';
import { ProjectState, TasksState } from '../../../../../states';
import { toSignal } from '@angular/core/rxjs-interop';

@UntilDestroy()
@Component({
  standalone: true,
  template: `
    <wbs-category-list-editor
      [(categories)]="categories"
      [categoryType]="cType()"
      [showSave]="true"
      (saveClicked)="save()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CategoryListEditorComponent, CommonModule],
  providers: [CategorySelectionService],
})
export class ProjectSettingsCategoriesComponent implements OnInit {
  categories?: CategorySelection[];
  readonly cType = toSignal(
    this.route.data.pipe(map((d) => <PROJECT_NODE_VIEW_TYPE>d['cType']))
  );

  constructor(
    private readonly catService: CategorySelectionService,
    private readonly cd: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    const data: Observable<any>[] = [
      this.store.select(ProjectState.current),
      this.store.select(TasksState.nodes),
      //this.store.select(TasksState.disciplines),
      //this.store.select(TasksState.phases),
      this.route.data,
    ];

    for (const obs of data)
      obs.pipe(untilDestroyed(this)).subscribe(() => this.rebuild());
  }

  save(): void {
    const project = this.store.selectSnapshot(ProjectState.current)!;
    const cType: PROJECT_NODE_VIEW_TYPE = this.route.snapshot.data['cType'];
    const cats =
      cType === PROJECT_NODE_VIEW.DISCIPLINE
        ? project.disciplines
        : project.phases;

    const results = this.catService.extract(this.categories, cats);

    this.store.dispatch(new ChangeProjectCategories(cType, results));
  }

  private rebuild(): void {
    const project = this.store.selectSnapshot(ProjectState.current);
    const cType: PROJECT_NODE_VIEW_TYPE = this.route.snapshot.data['cType'];

    if (!project) return;

    let cats: ProjectCategory[];
    let confirmMessage: string;
    //let nodes: WbsNodeView[];
    let counts = new Map<string, number>();
    const nodes = this.store.selectSnapshot(TasksState.nodes)!;

    if (cType === PROJECT_NODE_VIEW.DISCIPLINE) {
      cats = project.disciplines;
      //nodes = this.store.selectSnapshot(TasksState.disciplines) ?? [];
      confirmMessage = 'Projects.DisciplineRemoveConfirm';
    } else {
      cats = project.phases;
      //nodes = this.store.selectSnapshot(TasksState.phases) ?? [];
      confirmMessage = 'Projects.PhaseRemoveConfirm';
    }

    for (const cat of cats) {
      const id = typeof cat === 'string' ? cat : cat.id;
      const node = nodes.find((x) => x.id === id);

      if (cType === PROJECT_NODE_VIEW.PHASE) {
        counts.set(id, nodes.filter((x) => x.parentId === id).length);
      } else {
        counts.set(
          id,
          nodes.filter((x) => x.disciplineIds?.includes(id)).length
        );
      }
    }

    this.categories = this.catService.build(
      cType,
      cats,
      confirmMessage,
      counts
    );
    this.cd.detectChanges();
  }
}