import { Injectable, inject } from '@angular/core';
import {
  faCloudDownload,
  faCloudUpload,
} from '@fortawesome/pro-solid-svg-icons';
import { LIBRARY_CLAIMS } from '@wbs/core/models';
import { ActionButtonMenuItem } from '@wbs/main/models';
import { EntryService } from './entry.service';

@Injectable()
export class EntryActionButtonService {
  private readonly entryService = inject(EntryService);
  private readonly actionDownload = 'download';

  buildMenu(
    entryUrl: string[],
    claims: string[]
  ): ActionButtonMenuItem[] | undefined {
    const items: ActionButtonMenuItem[] = [
      { separator: true },
      {
        action: this.actionDownload,
        icon: faCloudDownload,
        text: 'Projects.DownloadTasks',
      },
    ];

    if (claims.includes(LIBRARY_CLAIMS.TASKS.UPDATE)) {
      items.push({
        icon: faCloudUpload,
        text: 'Projects.UploadTasks',
        route: [...entryUrl, 'upload'],
      });
    }
    return items.length === 0 ? undefined : items;
  }

  handleAction(action: string): void {
    console.log(action);
    switch (action) {
      case this.actionDownload:
        this.entryService.downloadTasks();
        break;
    }
  }
}
