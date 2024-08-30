import { Injectable, inject } from '@angular/core';
import {
  faBookArrowRight,
  faCheck,
  faCloudDownload,
  faCloudUpload,
  faPowerOff,
  faStamp,
  faXmarkToSlot,
  IconDefinition,
} from '@fortawesome/pro-solid-svg-icons';
import {
  ActionButtonMenuItem,
  PROJECT_CLAIMS,
  PROJECT_STATI,
} from '@wbs/core/models';
import { MenuService, Messages } from '@wbs/core/services';
import { MetadataStore } from '@wbs/core/store';
import { ProjectViewModel } from '@wbs/core/view-models';
import { PROJECT_NAVIGATION } from '../models';
import { ProjectStore } from '../stores';
import { LibraryEntryExportService } from './library-entry-export.service';
import { ProjectViewService } from './project-view.service';

@Injectable()
export class ProjectActionButtonService {
  private readonly actions = inject(ProjectViewService);
  private readonly exportService = inject(LibraryEntryExportService);
  private readonly menuService = inject(MenuService);
  private readonly messages = inject(Messages);
  private readonly metadata = inject(MetadataStore);
  private readonly store = inject(ProjectStore);

  private readonly actionApproval = 'approval';
  private readonly actionCancel = 'cancel';
  private readonly actionReturnPlanning = 'returnPlanning';
  private readonly actionReject = 'reject';
  private readonly actionApprove = 'approve';
  private readonly actionDownloadWbs = 'downloadWbs';
  private readonly actionDownloadAbs = 'downloadAbs';
  private readonly actionUpload = 'upload';
  private readonly actionExport = 'export';

  buildMenu(
    project: ProjectViewModel | undefined,
    claims: string[],
    projectUrl: string[],
    approvalEnabled: boolean
  ): ActionButtonMenuItem[] {
    if (!project) return [];

    const items: ActionButtonMenuItem[] = [this.header('General.Views')];
    const stati = PROJECT_STATI;

    for (const view of this.menuService.filterList(
      PROJECT_NAVIGATION,
      claims,
      project.status,
      project
    )) {
      items.push({
        resource: view.resource,
        faIcon: view.faIcon as IconDefinition | undefined,
        route: [...projectUrl, ...view.route!],
      });
    }

    items.push(
      this.header('General.Actions'),
      {
        action: this.actionDownloadWbs,
        faIcon: faCloudDownload,
        resource: 'Wbs.DownloadWbs',
      },
      {
        action: this.actionDownloadAbs,
        faIcon: faCloudDownload,
        resource: 'Wbs.DownloadAbs',
      }
    );

    if (
      project.status === stati.PLANNING &&
      claims.includes(PROJECT_CLAIMS.TASKS.UPDATE)
    ) {
      items.push({
        action: this.actionUpload,
        faIcon: faCloudUpload,
        resource: 'Wbs.UploadTasks',
      });
    }

    if (approvalEnabled) {
      items.push({ separator: true });

      if (project.status === stati.PLANNING) {
        if (claims.includes(PROJECT_CLAIMS.STATI.CAN_SUBMIT_FOR_APPROVAL)) {
          items.push({
            resource: 'Projects.SubmitForApproval',
            faIcon: faCheck,
            action: this.actionApproval,
          });
        }
      } else if (project.status === stati.APPROVAL) {
        if (claims.includes(PROJECT_CLAIMS.STATI.CAN_RETURN_TO_PLANNING)) {
          items.push({
            resource: 'Projects.ReturnToPlanning',
            faIcon: faStamp,
            action: this.actionReturnPlanning,
          });
        }
        if (claims.includes(PROJECT_CLAIMS.STATI.CAN_APPROVE)) {
          items.push({
            resource: 'Projects.ApproveProject',
            faIcon: faStamp,
            action: this.actionApprove,
          });
        }
        if (claims.includes(PROJECT_CLAIMS.STATI.CAN_REJECT)) {
          items.push({
            resource: 'Projects.RejectProject',
            faIcon: faXmarkToSlot,
            action: this.actionReject,
          });
        }
      }
    } else {
      if (project.status === stati.PLANNING) {
        items.push({ separator: true });

        if (claims.includes(PROJECT_CLAIMS.STATI.CAN_SUBMIT_FOR_APPROVAL)) {
          items.push({
            resource: 'Projects.SubmitForExecution',
            faIcon: faCheck,
            action: this.actionApprove,
          });
        }
      }
    }

    items.push({
      resource: 'Projects.ExportToLibrary',
      faIcon: faBookArrowRight,
      action: this.actionExport,
    });

    if (claims.includes(PROJECT_CLAIMS.STATI.CAN_CANCEL)) {
      if (items.length > 0) items.push({ separator: true });
      items.push({
        resource: 'Projects.CancelProject',
        faIcon: faPowerOff,
        action: this.actionCancel,
      });
    }
    return items;
  }

  handleAction(action: string, approvalEnabled: boolean): void {
    switch (action) {
      case this.actionDownloadAbs:
        this.actions.downloadTasks(true);
        break;

      case this.actionDownloadWbs:
        this.actions.downloadTasks(false);
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
    }
  }

  private export(): void {
    this.exportService.exportProject(this.store.project()!);
  }

  private cancel(): void {
    this.actions.confirmAndChangeStatus(
      PROJECT_STATI.CANCELLED,
      'Projects.CancelProjectConfirm',
      'Projects.CancelProjectSuccess'
    );
  }

  private approval(): void {
    const role = this.metadata.roles.ids.approver;
    const approvals = this.store
      .project()!
      .roles.filter((r) => r.role === role)
      .map((r) => r.user.userId);

    if (approvals.length === 0) {
      this.messages.report.failure(
        'General.Error',
        'Projects.SubmitForApprovalError'
      );
      return;
    }
    this.actions.confirmAndChangeStatus(
      PROJECT_STATI.APPROVAL,
      'Projects.SubmitForApprovalConfirm',
      'Projects.SubmitForApprovalSuccess'
    );
  }

  private backToPlanning(): void {
    this.actions.confirmAndChangeStatus(
      PROJECT_STATI.PLANNING,
      'Projects.ReturnToPlanningConfirm',
      'Projects.ReturnToPlanningSuccess'
    );
  }

  private reject(): void {
    this.actions.confirmAndChangeStatus(
      PROJECT_STATI.PLANNING,
      'Projects.RejectProjectConfirm',
      'Projects.RejectProjectSuccess'
    );
  }

  private approve(approvalEnabled: boolean): void {
    this.actions.confirmAndChangeStatus(
      PROJECT_STATI.EXECUTION,
      approvalEnabled
        ? 'Projects.ApproveProjectConfirm'
        : 'Projects.SubmitForExecutionConfirm',
      approvalEnabled
        ? 'Projects.ApproveProjectSuccess'
        : 'Projects.SubmitForExecutionSuccess'
    );
  }

  private header(resource: string): ActionButtonMenuItem {
    return {
      resource,
      disabled: true,
      isHeader: true,
      cssClass: ['bg-gray-400', 'fs-italic'],
    };
  }
}
