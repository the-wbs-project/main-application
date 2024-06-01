import { Injectable, inject } from '@angular/core';
import {
  faCloudDownload,
  faCloudUpload,
  faPlus,
} from '@fortawesome/pro-solid-svg-icons';
import { ActionButtonMenuItem, LIBRARY_CLAIMS } from '@wbs/core/models';
import { EntryService } from '@wbs/core/services/library';

@Injectable()
export class EntryActionButtonService {
  private readonly entryService = inject(EntryService);
  private readonly actionCreateProject = 'createProject';
  private readonly actionDownload = 'download';

  buildMenu(
    entryType: string,
    entryUrl: string[],
    claims: string[]
  ): ActionButtonMenuItem[] | undefined {
    const items: ActionButtonMenuItem[] = [];

    if (entryType === 'project') {
      items.push(
        {
          action: this.actionCreateProject,
          icon: faPlus,
          text: 'General.CreateProject',
        },
        { separator: true }
      );
    }
    items.push({
      action: this.actionDownload,
      icon: faCloudDownload,
      text: 'Wbs.DownloadTasks',
    });

    if (claims.includes(LIBRARY_CLAIMS.TASKS.UPDATE)) {
      items.push({
        icon: faCloudUpload,
        text: 'Wbs.UploadTasks',
        route: [...entryUrl, 'upload'],
      });
    }
    return items.length === 0 ? undefined : items;
  }

  handleAction(action: string): void {
    switch (action) {
      case this.actionDownload:
        this.entryService.downloadTasks();
        break;
      case this.actionCreateProject:
        this.entryService.createProject();
        break;
    }
  }
}
