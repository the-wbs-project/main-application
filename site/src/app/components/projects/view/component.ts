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
  WbsNode,
  WbsNodeView,
  WbsPhaseNode,
} from '@wbs/models';
import { Messages, TitleService, Transformers } from '@wbs/services';
import { ProjectState } from '@wbs/states';
import { BehaviorSubject, map, Observable } from 'rxjs';
import {
  ClearEditor,
  NodeEditorState,
  NodeSelected,
  OpenNodeCreationDialog,
} from '../../_features';

@UntilDestroy()
@Component({
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsViewComponent implements OnInit {
  @Select(ProjectState.current) project$!: Observable<Project>;
  @Select(NodeEditorState.node) node$!: Observable<WbsNodeView>;
  @Select(NodeEditorState.show) show$: Observable<boolean> | undefined;

  showDeleteDialog = false;
  private project: Project | undefined;
  private nodes: WbsNode[] | undefined;
  private node: string | undefined;
  readonly disciplineNodes$ = new BehaviorSubject<WbsDisciplineNode[] | null>(
    null
  );
  readonly phaseNodes$ = new BehaviorSubject<WbsPhaseNode[] | null>(null);
  readonly view$ = new BehaviorSubject<string | null>(null);
  readonly nodeView$ = new BehaviorSubject<string | null>(null);

  constructor(
    title: TitleService,
    private readonly messages: Messages,
    private readonly route: ActivatedRoute,
    private readonly store: Store,
    private readonly transformers: Transformers
  ) {
    title.setTitle('Drag and Drop Demo', false);
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
    this.route.params
      //.pipe(untilDestroyed(this))
      .subscribe((params) => {
        this.view$.next(params['view']);
        this.nodeView$.next(params['nodeView']);
        this.updateNodeViews();
      });

    this.store
      .select(ProjectState.current)
      //.pipe(untilDestroyed(this))
      .subscribe((project) => {
        this.project = project;
        this.updateNodeViews();
      });

    this.store
      .select(ProjectState.nodes)
      //.pipe(untilDestroyed(this))
      .subscribe((nodes) => {
        this.nodes = nodes;
        this.updateNodeViews();
      });
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
    if (action === 'delete') {
      this.showDeleteDialog = true;
    } else if (action === 'add') {
      this.store.dispatch(
        new OpenNodeCreationDialog(
          this.store.selectSnapshot(NodeEditorState.node)!,
          this.currentView
        )
      );
    }
  }

  nodeDeleted(reason: string | null) {
    this.showDeleteDialog = false;

    if (reason) {
      this.messages.success(reason);
    }
  }

  private updateNodeViews() {
    console.log('updating');
    const view = this.nodeView$.getValue();

    if (!view || !this.project || !this.nodes) return;

    if (view === PROJECT_NODE_VIEW.DISCIPLINE) {
      this.disciplineNodes$.next(
        this.transformers.wbsNodeDiscipline.run(this.project, this.nodes)
      );
      this.phaseNodes$.next(null);
    } else {
      this.phaseNodes$.next(
        this.transformers.wbsNodePhase.run(this.project, this.nodes)
      );
      this.disciplineNodes$.next(null);
    }
  }
}
