import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Project, ProjectLite, WbsPhaseNode } from '@wbs/models';
import { TitleService } from '@wbs/services';
import { map, Observable } from 'rxjs';

@Component({
  templateUrl: './component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragAndDropComponent {
  readonly nodes$: Observable<WbsPhaseNode[] | null>;
  readonly project$: Observable<Project>;
  readonly view$: Observable<string | null>;

  constructor(
    title: TitleService,
    private readonly route: ActivatedRoute,
    private readonly store: Store
  ) {
    title.setTitle('Drag and Drop Demo', false);

    this.view$ = this.route.params.pipe(map((p) => p['view']));
    this.nodes$ = this.route.data.pipe(map((d) => d['pageData']!['nodes']));
    this.project$ = this.route.data.pipe(map((d) => d['pageData']!['project']));
  }

  ngOnInit(): void {}

  viewChanged(view: string): void {
    const params = this.route.snapshot.params;

    this.store.dispatch(
      new Navigate([
        'demos',
        'drag-and-drop',
        params['owner'],
        params['projectId'],
        view,
      ])
    );
  }
}
