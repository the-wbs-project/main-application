import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { ContextMenuSelectEvent } from '@progress/kendo-angular-menu';
import { DownloadNodes, UploadNodes } from '@wbs/components/projects/actions';

@Component({
  selector: 'wbs-project-view-actions',
  template: `<div #target class="tx-white wd-25 pointer">
      <kendo-icon name="more-vertical"></kendo-icon>
    </div>
    <kendo-contextmenu
      [target]="target"
      showOn="click"
      (select)="selected($event)"
    >
      <kendo-menu-item
        icon="download"
        [text]="'Projects.DownloadNodes' | translate"
      >
      </kendo-menu-item>
      <kendo-menu-item
        icon="upload"
        [text]="'Projects.UploadNodes' | translate"
      >
      </kendo-menu-item>
    </kendo-contextmenu>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ProjectViewActionsComponent {
  constructor(private readonly store: Store) {}

  selected(e: ContextMenuSelectEvent) {
    if (e.item.icon === 'download') {
      this.store.dispatch(new DownloadNodes());
    } else if (e.item.icon === 'upload') {
      this.store.dispatch(new UploadNodes());
    }
  }
}
