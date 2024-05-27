import { Pipe, PipeTransform } from '@angular/core';
import { PROJECT_STATI } from '@wbs/core/models';

@Pipe({ name: 'projectStatusList', standalone: true })
export class ProjectStatusListPipe implements PipeTransform {
  transform(status: string[] | undefined): string[] {
    return (status ?? []).map((s) => this.getStatus(s));
  }

  private getStatus(status: string): string {
    if (status === PROJECT_STATI.APPROVAL) return 'Projects.WaitingApproval';
    if (status === PROJECT_STATI.CLOSED) return 'General.Closed';
    if (status === PROJECT_STATI.EXECUTION) return 'General.Execution';
    if (status === PROJECT_STATI.FOLLOW_UP) return 'General.FollowUp';
    if (status === PROJECT_STATI.PLANNING) return 'General.Planning';
    if (status === PROJECT_STATI.CANCELLED) return 'General.Cancelled';
    return '';
  }
}
