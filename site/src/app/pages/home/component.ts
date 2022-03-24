import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WbsPhaseNode } from '@app/models';
import { DataServiceFactory, TitleService } from '@app/services';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
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
