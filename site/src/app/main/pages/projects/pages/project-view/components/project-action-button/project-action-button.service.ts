import { Injectable } from '@angular/core';
import {
  faCheck,
  faPowerOff,
  faStamp,
  faXmarkToSlot,
} from '@fortawesome/pro-solid-svg-icons';
import { Store } from '@ngxs/store';
import {
  PROJECT_CLAIMS,
  PROJECT_STATI,
  PROJECT_STATI_TYPE,
  Project,
} from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { RoleState } from '@wbs/main/states';
import { of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ChangeProjectStatus } from '../../actions';
import { ProjectState } from '../../states';
import { ProjectAction } from './project-action.model';

@Injectable()
export class ProjectActionButtonService {
  private readonly actionApproval = 'approval';
  private readonly actionCancel = 'cancel';
  private readonly actionReturnPlanning = 'returnPlanning';
  private readonly actionReject = 'reject';
  private readonly actionApprove = 'approve';

  constructor(
    private readonly messages: Messages,
    private readonly store: Store
  ) {}

  buildMenu(project: Project, claims: string[]): ProjectAction[] | undefined {
    const items: ProjectAction[] = [];
    const stati = PROJECT_STATI;

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

  handleAction(action: string): void {
    switch (action) {
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
        this.approve();
        break;
    }
  }

  private cancel(): void {
    this.confirmAndChange(
      PROJECT_STATI.CANCELLED,
      'Projects.CancelProjectConfirm',
      'Projects.CancelProjectSuccess'
    );
  }

  private approval(): void {
    const roleIds = this.store.selectSnapshot(RoleState.ids)!;
    const approvals = this.store
      .selectSnapshot(ProjectState.current)!
      .roles.filter((r) => r.role === roleIds.approver)
      .map((r) => r.userId);

    if (approvals.length === 0) {
      this.messages.report.failure(
        'General.Error',
        'Projects.SubmitForApprovalError'
      );
      return;
    }
    this.confirmAndChange(
      PROJECT_STATI.APPROVAL,
      'Projects.SubmitForApprovalConfirm',
      'Projects.SubmitForApprovalSuccess'
    );
  }

  private backToPlanning(): void {
    this.confirmAndChange(
      PROJECT_STATI.PLANNING,
      'Projects.ReturnToPlanningConfirm',
      'Projects.ReturnToPlanningSuccess'
    );
  }

  private reject(): void {
    this.confirmAndChange(
      PROJECT_STATI.PLANNING,
      'Projects.RejectProjectConfirm',
      'Projects.RejectProjectSuccess'
    );
  }

  private approve(): void {
    this.confirmAndChange(
      PROJECT_STATI.EXECUTION,
      'Projects.ApproveProjectConfirm',
      'Projects.ApproveProjectSuccess'
    );
  }

  private confirmAndChange(
    status: PROJECT_STATI_TYPE,
    confirmMessage: string,
    successMessage: string
  ) {
    this.messages.confirm
      .show('General.Confirm', confirmMessage)
      .pipe(
        switchMap((answer: boolean) => {
          if (!answer) return of();

          return this.store
            .dispatch(new ChangeProjectStatus(status))
            .pipe(
              tap(() =>
                this.messages.report.success('General.Success', successMessage)
              )
            );
        })
      )
      .subscribe();
  }
}
