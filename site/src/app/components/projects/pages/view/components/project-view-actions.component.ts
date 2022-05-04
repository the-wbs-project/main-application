import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'wbs-project-view-actions',
  template: `<button #target type="button" class="btn btn-success">
      <kendo-icon name="gear"></kendo-icon>
    </button>
    <kendo-contextmenu [target]="target" showOn="click">
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
export class ProjectViewActionsComponent {}
