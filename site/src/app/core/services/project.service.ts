import { Injectable } from '@angular/core';
import { Project, PROJECT_STATI, PROJECT_VIEW_STATI } from '../models';
import { Resources } from './resource.service';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  constructor(private readonly resources: Resources) {}

  filter(projects: Project[] | null | undefined, status: string): Project[] {
    if (status === PROJECT_VIEW_STATI.ACTIVE)
      return (projects ?? []).filter((x) => x.status !== PROJECT_STATI.CLOSED);

    return (projects ?? []).filter((x) => x.status === status);
  }

  getStatus(status: string): string {
    return this.resources.get(this.getStatusResource(status));
  }

  getStatusResource(status: string): string {
    if (status === PROJECT_VIEW_STATI.ACTIVE) return 'General.Active';
    if (status === PROJECT_VIEW_STATI.APPROVAL)
      return 'Projects.WaitingApproval';
    if (status === PROJECT_VIEW_STATI.EXECUTION) return 'General.Execution';
    if (status === PROJECT_VIEW_STATI.EXECUTION) return 'General.Execution';
    if (status === PROJECT_VIEW_STATI.FOLLOW_UP) return 'General.FollowUp';
    if (status === PROJECT_VIEW_STATI.PLANNING) return 'General.Planning';
    return '';
  }
}
