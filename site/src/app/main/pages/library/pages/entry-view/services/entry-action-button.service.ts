import { Injectable } from '@angular/core';
import {
  faCloudDownload,
  faCloudUpload,
} from '@fortawesome/pro-solid-svg-icons';
import { Store } from '@ngxs/store';
import {
  LIBRARY_CLAIMS,
  LibraryEntry,
  LibraryEntryVersion,
} from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { ActionButtonMenuItem } from '@wbs/main/models';

@Injectable()
export class EntryActionButtonService {
  //private readonly actionCancel = 'cancel';
  private readonly actionDownload = 'download';
  private readonly actionUpload = 'upload';

  constructor(
    //private readonly actions: ProjectViewService,
    //private readonly exportService: LibraryEntryExportService,
    private readonly messages: Messages,
    private readonly store: Store
  ) {}

  buildMenu(
    entry: LibraryEntry,
    version: LibraryEntryVersion,
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
        action: this.actionUpload,
        icon: faCloudUpload,
        text: 'Projects.UploadTasks',
      });
    }

    /*if (claims.includes(PROJECT_CLAIMS.STATI.CAN_CANCEL)) {
      if (items.length > 0) items.push({ separator: true });
      items.push({
        text: 'Projects.CancelProject',
        icon: faPowerOff,
        action: this.actionCancel,
      });
    }*/
    return items.length === 0 ? undefined : items;
  }

  handleAction(action: string): void {
    /*
    switch (action) {
      case this.actionDownload:
        this.actions.downloadTasks();
        break;

      case this.actionUpload:
        this.actions.uploadTasks();
        break;

      case this.actionApproval:
        this.approval();
        break;

      case this.actionCancel:
        this.cancel();
        break;

      case this.actionReturnPlanning:
        this.backToPlanning();
        break;

      case this.actionReject:
        this.reject();
        break;

      case this.actionApprove:
        this.approve(approvalEnabled);
        break;

      case this.actionExport:
        this.export();
        break;
    }*/
  }

  /*
  private export(): void {
    this.exportService.exportProject(
      this.store.selectSnapshot(ProjectState.current)!
    );
  }

  private cancel(): void {
    this.actions.confirmAndChangeStatus(
      PROJECT_STATI.CANCELLED,
      'Projects.CancelProjectConfirm',
      'Projects.CancelProjectSuccess'
    );
  }
  */
}
