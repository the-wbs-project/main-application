import { Injectable, inject } from '@angular/core';
import {
  faBookArrowRight,
  faCheck,
  faCloudDownload,
  faCloudUpload,
  faPowerOff,
  faStamp,
  faXmarkToSlot,
} from '@fortawesome/pro-solid-svg-icons';
import { Store } from '@ngxs/store';
import { PROJECT_CLAIMS, PROJECT_STATI } from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { MetadataStore } from '@wbs/core/store';
import { ProjectViewModel } from '@wbs/core/view-models';
import { ProjectAction } from '../models';
import { ProjectState } from '../states';
import { LibraryEntryExportService } from './library-entry-export.service';
import { ProjectViewService } from './project-view.service';

@Injectable()
export class ProjectActionButtonService {
  private readonly actions = inject(ProjectViewService);
  private readonly exportService = inject(LibraryEntryExportService);
  private readonly messages = inject(Messages);
  private readonly metadata = inject(MetadataStore);
  private readonly store = inject(Store);

  private readonly actionApproval = 'approval';
  private readonly actionCancel = 'cancel';
  private readonly actionReturnPlanning = 'returnPlanning';
  private readonly actionReject = 'reject';
  private readonly actionApprove = 'approve';
  private readonly actionDownload = 'download';
  private readonly actionUpload = 'upload';
  private readonly actionExport = 'export';

  buildMenu(
    project: ProjectViewModel,
    claims: string[],
    approvalEnabled: boolean
  ): ProjectAction[] | undefined {
    const stati = PROJECT_STATI;
    const items: ProjectAction[] = [
      { separator: true },
      {
        action: this.actionDownload,
        icon: faCloudDownload,
        text: 'Projects.DownloadTasks',
      },
    ];

    if (
      project.status === stati.PLANNING &&
      claims.includes(PROJECT_CLAIMS.TASKS.UPDATE)
    ) {
      items.push({
        action: this.actionUpload,
        icon: faCloudUpload,
        text: 'Projects.UploadTasks',
      });
    }

    if (approvalEnabled) {
      items.push({ separator: true });

      if (project.status === stati.PLANNING) {
        if (claims.includes(PROJECT_CLAIMS.STATI.CAN_SUBMIT_FOR_APPROVAL)) {
          items.push({
            text: 'Projects.SubmitForApproval',
            icon: faCheck,
            action: this.actionApproval,
          });
        }
      } else if (project.status === stati.APPROVAL) {
        if (claims.includes(PROJECT_CLAIMS.STATI.CAN_RETURN_TO_PLANNING)) {
          items.push({
            text: 'Projects.ReturnToPlanning',
            icon: faStamp,
            action: this.actionReturnPlanning,
          });
        }
        if (claims.includes(PROJECT_CLAIMS.STATI.CAN_APPROVE)) {
          items.push({
            text: 'Projects.ApproveProject',
            icon: faStamp,
            action: this.actionApprove,
          });
        }
        if (claims.includes(PROJECT_CLAIMS.STATI.CAN_REJECT)) {
          items.push({
            text: 'Projects.RejectProject',
            icon: faXmarkToSlot,
            action: this.actionReject,
          });
        }
      }
    } else {
      if (project.status === stati.PLANNING) {
        items.push({ separator: true });

        if (claims.includes(PROJECT_CLAIMS.STATI.CAN_SUBMIT_FOR_APPROVAL)) {
          items.push({
            text: 'Projects.SubmitForExecution',
            icon: faCheck,
            action: this.actionApprove,
          });
        }
      }
    }

    items.push({
      text: 'Projects.ExportToLibrary',
      icon: faBookArrowRight,
      action: this.actionExport,
    });

    if (claims.includes(PROJECT_CLAIMS.STATI.CAN_CANCEL)) {
      if (items.length > 0) items.push({ separator: true });
      items.push({
        text: 'Projects.CancelProject',
        icon: faPowerOff,
        action: this.actionCancel,
      });
    }
    return items.length === 0 ? undefined : items;
  }

  handleAction(action: string, approvalEnabled: boolean): void {
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
    }
  }

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

  private approval(): void {
    const role = this.metadata.roles.ids.approver;
    const approvals = this.store
      .selectSnapshot(ProjectState.current)!
      .roles.filter((r) => r.role === role)
      .map((r) => r.userId);

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
}
