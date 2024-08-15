import { Injectable, inject } from '@angular/core';
import {
  faBooks,
  faCloudDownload,
  faCloudUpload,
  faCodeBranch,
  faEye,
  faPencil,
  faPlus,
} from '@fortawesome/pro-solid-svg-icons';
import {
  ActionButtonMenuItem,
  LIBRARY_CLAIMS,
  LibraryEntryVersionBasic,
} from '@wbs/core/models';
import { EntryService } from '@wbs/core/services/library';
import { LibraryVersionViewModel } from '@wbs/core/view-models';

@Injectable()
export class EntryActionButtonService {
  private readonly entryService = inject(EntryService);
  private readonly actionCreateProject = 'createProject';
  private readonly actionNewVersion = 'newVersion';
  private readonly actionDownloadWbs = 'downloadWbs';
  private readonly actionDownloadAbs = 'downloadAbs';
  private readonly actionPublish = 'publish';
  private readonly actionUnpublish = 'unpublish';

  buildMenu(
    versions: LibraryEntryVersionBasic[],
    version: LibraryVersionViewModel,
    entryUrl: string[],
    claims: string[]
  ): ActionButtonMenuItem[] | undefined {
    const items: ActionButtonMenuItem[] = [];
    const canUpdate = claims.includes(LIBRARY_CLAIMS.UPDATE);
    const canUpdateTasks = claims.includes(LIBRARY_CLAIMS.TASKS.UPDATE);

    if (version.type === 'project') {
      items.push({
        action: this.actionCreateProject,
        faIcon: faPlus,
        resource: 'General.CreateProject',
      });
    }
    items.push({
      action: this.actionDownloadWbs,
      faIcon: faCloudDownload,
      resource: 'Wbs.DownloadWbs',
    });

    /*items.push({
      action: this.actionDownloadAbs,
      faIcon: faCloudDownload,
      text: 'Wbs.DownloadAbs',
    });*/

    if (version.status === 'draft' && canUpdateTasks) {
      items.push({
        faIcon: faCloudUpload,
        resource: 'Wbs.UploadTasks',
        route: [...entryUrl, 'upload'],
      });
    }

    if (canUpdate) {
      const versionItems: ActionButtonMenuItem[] = [
        {
          action: this.actionNewVersion,
          faIcon: faPlus,
          resource: 'Library.CreateNewVersion',
        },
        ...versions
          .filter((v) => v.version !== version.version)
          .map((v) => ({
            faIcon: faEye,
            text:
              `v${v.version}` + (v.versionAlias ? ` - ${v.versionAlias}` : ''),
            route: [...entryUrl.slice(0, -1), v.version.toString()],
          })),
      ];

      items.push({
        faIcon: faCodeBranch,
        resource: 'General.Versions',
        items: versionItems,
      });

      if (version.status === 'draft') {
        items.push({
          action: this.actionPublish,
          faIcon: faBooks,
          resource: 'Wbs.PublishToLibrary',
        });
      } else if (version.status === 'published') {
        items.push({
          action: this.actionUnpublish,
          faIcon: faPencil,
          resource: 'Wbs.UnpublishForEditing',
        });
      }
    }
    return items.length === 0 ? undefined : items;
  }

  handleAction(action: string): void {
    switch (action) {
      case this.actionDownloadAbs:
        this.entryService.downloadTasks();
        break;
      case this.actionDownloadWbs:
        this.entryService.downloadTasks();
        break;
      case this.actionCreateProject:
        this.entryService.createProject();
        break;
      case this.actionPublish:
        this.entryService.publish();
        break;
      case this.actionUnpublish:
        this.entryService.unpublish();
        break;
      case this.actionNewVersion:
        this.entryService.createNewVersion();
        break;
    }
  }
}
