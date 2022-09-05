import { Injectable } from '@angular/core';
import { PROJECT_VIEW_STATI } from '../models';
import { Resources } from './resource.service';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  constructor(private readonly resources: Resources) {}

  getStatus(status: string): string {
    return this.resources.get(this.getStatusResource(status));
  }

  getStatusResource(status: string): string {
    if (status === PROJECT_VIEW_STATI.ACTIVE) return 'General.Active';
    if (status === PROJECT_VIEW_STATI.CLOSED) return 'General.Closed';
    if (status === PROJECT_VIEW_STATI.EXECUTION) return 'General.Execution';
    if (status === PROJECT_VIEW_STATI.FOLLOW_UP) return 'General.FollowUp';
    if (status === PROJECT_VIEW_STATI.PLANNING) return 'General.Planning';
    return '';
  }
}
