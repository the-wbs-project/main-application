import { Context } from '../../config';
import { ProjectRole } from '../../models';
import { OriginService } from '../origin.service';

export class ProjectDataService {
  constructor(private readonly ctx: Context) {}

  private get origin(): OriginService {
    return this.ctx.get('origin');
  }

  async getRolesAsync(owner: string, project: string): Promise<ProjectRole[]> {
    return (await this.origin.getAsync<ProjectRole[]>(`portfolio/${owner}/projects/${project}/roles`)) ?? [];
  }
}
