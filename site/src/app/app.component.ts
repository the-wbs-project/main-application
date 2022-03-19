import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DrawerItem, DrawerSelectEvent } from '@progress/kendo-angular-layout';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Project, PROJECT_VIEW, PROJECT_VIEW_TYPE } from './models';
import { IdService } from './services';
import { Transformer } from './services/transformer.service';
import { ProjectViewModel, WbsNodeViewModel } from './view-models';

@Component({
  selector: 'wbs-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  private project: ProjectViewModel | undefined;
  readonly nodes$ = new BehaviorSubject<WbsNodeViewModel[] | undefined>(
    undefined
  );
  readonly view$ = new BehaviorSubject<PROJECT_VIEW_TYPE>(PROJECT_VIEW.PHASE);

  public selected = 'Inbox';

  public items: Array<DrawerItem> = [
    { text: 'Inbox', icon: 'k-i-inbox', selected: true },
    { separator: true },
    { text: 'Notifications', icon: 'k-i-bell' },
    { text: 'Calendar', icon: 'k-i-calendar' },
    { separator: true },
    { text: 'Attachments', icon: 'k-i-hyperlink-email' },
    { text: 'Favourites', icon: 'k-i-star-outline' },
  ];

  constructor(private readonly transformer: Transformer) {}

  ngOnInit(): void {
    const project: Project = environment.testProject;

    for (const node of project.nodes) node.id = IdService.generate();

    this.project = this.transformer.project(project);
    this.setNodes();
  }

  onSelect(ev: DrawerSelectEvent): void {
    this.selected = ev.item.text;
  }

  viewChanged(view: string): void {
    this.view$.next(<PROJECT_VIEW_TYPE>view);
    this.setNodes();
  }

  private setNodes() {
    if (!this.project) return;

    const view = this.view$.getValue();
    this.nodes$.next(
      this.transformer.wbsNodeTree(
        view,
        this.project.categories.get(view) ?? [],
        this.project.nodes
      )
    );
  }
}
