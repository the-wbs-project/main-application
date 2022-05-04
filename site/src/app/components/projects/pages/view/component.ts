import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import {
  Project,
  PROJECT_NODE_VIEW,
  PROJECT_NODE_VIEW_TYPE,
  PROJECT_VIEW,
  WbsDisciplineNode,
  WbsNodeView,
  WbsPhaseNode,
} from '@wbs/shared/models';
import { Messages, TitleService, Transformers } from '@wbs/shared/services';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import {
  ClearEditor,
  NodeEditorState,
  NodeSelected,
  OpenNodeCreationDialog,
  WbsNodeDeleteService,
} from '../../../_features';
import { RemoveNodeToProject } from '../../actions';
import { ProjectState } from '../../states';

@UntilDestroy()
@Component({
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsViewComponent implements OnInit {
  @Select(ProjectState.current) project$!: Observable<Project>;
  @Select(NodeEditorState.node) node$!: Observable<WbsNodeView>;
  @Select(NodeEditorState.show) show$: Observable<boolean> | undefined;

  private node: string | undefined;
  readonly disciplineNodes$ = new BehaviorSubject<WbsDisciplineNode[] | null>(
    null
  );
  readonly phaseNodes$ = new BehaviorSubject<WbsPhaseNode[] | null>(null);
  readonly view$ = new BehaviorSubject<string | null>(null);
  readonly nodeView$ = new BehaviorSubject<string | null>(null);

  constructor(
    title: TitleService,
    private readonly deleteService: WbsNodeDeleteService,
    private readonly messages: Messages,
    private readonly route: ActivatedRoute,
    private readonly store: Store,
    private readonly transformers: Transformers
  ) {
    title.setTitle('Project', false);
  }

  private get currentView(): PROJECT_NODE_VIEW_TYPE {
    return this.route.snapshot.params['view'];
  }

  private get currentNodeView(): PROJECT_NODE_VIEW_TYPE {
    return this.route.snapshot.params['nodeView'];
  }

  private get projectId(): string {
    return this.route.snapshot.params['projectId'];
  }

  ngOnInit(): void {
    this.route.params.pipe(untilDestroyed(this)).subscribe((params) => {
      this.view$.next(params['view']);
      this.nodeView$.next(params['nodeView']);
      this.updateNodeViews();
    });
    this.store
      .select(ProjectState.current)
      .pipe(untilDestroyed(this))
      .subscribe(() => this.updateNodeViews());

    this.store
      .select(ProjectState.nodes)
      .pipe(untilDestroyed(this))
      .subscribe(() => this.updateNodeViews());
  }

  viewChanged(view: string): void {
    this.node = undefined;
    const path = ['projects', 'view', this.projectId, view];

    if (view === PROJECT_VIEW.WBS) {
      //const project = this.store.selectSnapshot(ProjectState.current);
      const view = 'phase'; //project.mainView;

      path.push(view);
    }

    this.store.dispatch(new Navigate(path));
  }

  nodeViewChanged(nodeView: string): void {
    this.node = undefined;

    this.store.dispatch([
      new ClearEditor(),
      new Navigate([
        'projects',
        'view',
        this.projectId,
        this.currentView,
        nodeView,
      ]),
    ]);
  }

  nodeSelected(project: Project, node: WbsNodeView) {
    this.node = node.id;

    this.store.dispatch(
      new NodeSelected(
        node,
        this.currentNodeView,
        project.activity?.filter((x) => x.wbsId === node.id)
      )
    );
  }

  nodeMenuClicked(action: string) {
    const node = this.store.selectSnapshot(NodeEditorState.node)!;

    if (action === 'delete') {
      this.deleteService
        .launchAsync(node.id)
        .pipe(
          tap((reason) => {
            if (reason)
              return this.store.dispatch(
                new RemoveNodeToProject(node.id, reason)
              );
            return of();
          })
        )
        .subscribe();
    } else if (action === 'add') {
      this.store.dispatch(new OpenNodeCreationDialog(node, this.currentView));
    }
  }

  private updateNodeViews() {
    const view = this.nodeView$.getValue();
    const nodes = this.store.selectSnapshot(ProjectState.nodes);
    const project = this.store.selectSnapshot(ProjectState.current);

    if (!view || !project || !nodes) return;

    if (view === PROJECT_NODE_VIEW.DISCIPLINE) {
      this.disciplineNodes$.next(
        this.transformers.wbsNodeDiscipline.run(project, nodes)
      );
      this.phaseNodes$.next(null);
    } else {
      this.phaseNodes$.next(this.transformers.wbsNodePhase.run(project, nodes));
      this.disciplineNodes$.next(null);
    }
  }
}
