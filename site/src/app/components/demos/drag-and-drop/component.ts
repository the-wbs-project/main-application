import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WbsPhaseNode } from '@wbs/models';
import { DataServiceFactory, TitleService } from '@wbs/services';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragAndDropComponent {
  nodes$: Observable<WbsPhaseNode[] | null> | undefined;

  constructor(
    title: TitleService,
    private readonly dataServices: DataServiceFactory
  ) {
    title.setTitle('Drag and Drop Demo', false);
  }

  ngOnInit(): void {
    this.nodes$ = this.dataServices.wbs.getPhaseList('acme_engineering', '123');
  }

  viewChanged(view: string): void {}
}
