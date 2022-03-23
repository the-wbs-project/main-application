import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  Category,
  PROJECT_VIEW,
  PROJECT_VIEW_TYPE,
  WbsNode,
} from '@app/models';
import { DataServiceFactory, TitleService } from '@app/services';
import { Transformer } from '@app/services/transformer.service';
import { ProjectViewModel } from '@app/view-models';
import { BehaviorSubject } from 'rxjs';

@Component({
  templateUrl: './component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private project: ProjectViewModel | undefined;
  readonly cats$ = new BehaviorSubject<Category[] | undefined>(undefined);
  readonly nodes$ = new BehaviorSubject<WbsNode[] | undefined>(undefined);
  readonly view$ = new BehaviorSubject<PROJECT_VIEW_TYPE>(PROJECT_VIEW.PHASE);

  constructor(
    title: TitleService,
    private readonly dataServices: DataServiceFactory,
    private readonly transformer: Transformer
  ) {
    title.setTitle('Drag and Drop Demo', false);
  }

  ngOnInit(): void {
    this.dataServices.project
      .getAsync('acme_engineering', '123')
      .subscribe((project) => {
        this.project = this.transformer.project(project);
        this.cats$.next(this.project.categories.get(PROJECT_VIEW.PHASE));
        this.nodes$.next(project.nodes);
      });
  }

  viewChanged(view: string): void {
    this.view$.next(<PROJECT_VIEW_TYPE>view);
  }
}
