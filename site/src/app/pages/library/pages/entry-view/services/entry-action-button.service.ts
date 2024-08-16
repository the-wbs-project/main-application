import { Injectable, inject } from '@angular/core';
import {
  faBooks,
  faCloudDownload,
  faCloudUpload,
  faCodeBranch,
  faPencil,
  faPlus,
  faXmark,
  IconDefinition,
} from '@fortawesome/pro-solid-svg-icons';
import {
  ActionButtonMenuItem,
  LIBRARY_CLAIMS,
  LibraryEntryVersionBasic,
  RouteContextMenuItem,
} from '@wbs/core/models';
import { MenuService } from '@wbs/core/services';
import { EntryService } from '@wbs/core/services/library';
import { MembershipStore } from '@wbs/core/store';
import { LibraryVersionViewModel } from '@wbs/core/view-models';
import { ENTRY_NAVIGATION2 } from '../models';

@Injectable()
export class EntryActionButtonService {
  private readonly membership = inject(MembershipStore);
  private readonly entryService = inject(EntryService);
  private readonly menuService = inject(MenuService);
  private readonly actionCreateProject = 'createProject';
  private readonly actionNewVersion = 'newVersion';
  private readonly actionDownloadWbs = 'downloadWbs';
  private readonly actionDownloadAbs = 'downloadAbs';
  private readonly actionPublish = 'publish';
  private readonly actionCancelVersion = 'cancelVersion';
  private readonly actionUnpublish = 'unpublish';

  buildMenu(
    versions: LibraryEntryVersionBasic[],
    version: LibraryVersionViewModel,
    entryUrl: string[],
    claims: string[]
  ): ActionButtonMenuItem[] | undefined {
    const canUpdate = claims.includes(LIBRARY_CLAIMS.UPDATE);
    const canUpdateTasks = claims.includes(LIBRARY_CLAIMS.TASKS.UPDATE);
    const items: ActionButtonMenuItem[] = [this.header('General.Views')];
    const org = this.membership.membership()?.name;

    for (const view of this.menuService.filterList(
      ENTRY_NAVIGATION2,
      claims,
      version.status,
      version
    )) {
      items.push({
        resource: view.resource,
        faIcon: view.faIcon as IconDefinition | undefined,
        route: [...entryUrl, ...view.route!],
        items: view.items?.map((v) => ({
          resource: v.resource,
          faIcon: view.faIcon as IconDefinition | undefined,
          route: [...entryUrl, ...(v as RouteContextMenuItem).route!],
        })),
      });
    }
    items.push(this.header('General.Versioning'));
    if (canUpdate) {
      items.push({
        action: this.actionNewVersion,
        faIcon: faPlus,
        resource: 'Library.CreateNewVersion',
      });
    }

    if (org === version.ownerId) {
      //
      //  Ok, we can see drafts, add if there are any.
      //
      var drafts = versions.filter((v) => v.status === 'draft');

      if (drafts.length > 0) {
        items.push({
          faIcon: faPencil,
          resource: 'General.Drafts',
          items: [
            ...drafts.map((v) => ({
              text: this.versionName(v),
              route: [...entryUrl.slice(0, -1), v.version.toString()],
            })),
          ],
        });
      }
    }
    var published = versions.filter((v) => v.status === 'published');

    if (published.length > 0) {
      items.push({
        faIcon: faCodeBranch,
        resource: 'General.Versions',
        items: published.map((v) => ({
          text: this.versionName(v),
          route: [...entryUrl.slice(0, -1), v.version.toString()],
        })),
      });
    }

    if (canUpdate) {
      if (version.status === 'draft') {
        items.push({
          action: this.actionCancelVersion,
          faIcon: faXmark,
          resource: 'Wbs.CancelVersion',
        });
      }
      if (version.status !== 'published') {
        items.push({
          action: this.actionPublish,
          faIcon: faBooks,
          resource: 'Wbs.PublishVersion',
        });
      } else if (version.status === 'published') {
        items.push({
          action: this.actionUnpublish,
          faIcon: faPencil,
          resource: 'Wbs.UnpublishForEditing',
        });
      }
    }

    items.push(this.header('General.Actions'));

    if (version.status === 'published' && version.type === 'project') {
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

    if (version.status === 'draft' && canUpdateTasks) {
      items.push({
        faIcon: faCloudUpload,
        resource: 'Wbs.UploadTasks',
        route: [...entryUrl, 'upload'],
      });
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
      case this.actionCancelVersion:
        this.entryService.cancelVersion();
        break;
    }
  }

  private header(resource: string): ActionButtonMenuItem {
    return {
      resource,
      disabled: true,
      isHeader: true,
      cssClass: ['bg-gray-400', 'fs-italic'],
    };
  }

  private versionName(
    version: LibraryEntryVersionBasic | LibraryVersionViewModel
  ): string {
    return (
      `v${version.version}` +
      (version.versionAlias ? ` - ${version.versionAlias}` : '')
    );
  }
}
