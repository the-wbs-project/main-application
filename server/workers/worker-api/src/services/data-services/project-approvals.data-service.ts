import { ContextLocal } from '../../config';
import { ProjectApproval } from '../../models';
import { BaseDataService } from './base.data-service';

export class ProjectApprovalsDataService extends BaseDataService {
  constructor(ctx: ContextLocal) {
    super(ctx);
  }

  async getAsync(owner: string, projectId: string): Promise<ProjectApproval[]> {
    const key = this.getKey(owner, projectId);
    const kvData = await this.getKv<ProjectApproval[]>(key);

    if (kvData) return kvData;

    const data = await this.origin.getAsync<ProjectApproval[]>(this.getUrl(owner, projectId));

    if (data) this.putKv(key, data);

    return data ?? [];
  }

  private getUrl(owner: string, projectId: string): string {
    return `portfolio/${owner}/projects/${projectId}/approvals`;
  }

  private getKey(owner: string, projectId: string): string {
    return `PORTFOLIO|${owner}|PROJECT|${projectId}|APPROVALS`;
  }
}
