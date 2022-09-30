import { ProjectSnapshot } from '../../models';
import { EdgeService } from '../edge-services';
import { StorageService } from '../storage-services';
import { ProjectNodeDataService } from './project-node.data-service';
import { ProjectDataService } from './project.data-service';

export class ProjectSnapshotDataService {
  constructor(
    private readonly bucket: StorageService,
    private readonly edge: EdgeService,
    private readonly projectService: ProjectDataService,
    private readonly taskService: ProjectNodeDataService,
    private readonly organization: string,
  ) {}

  getAsync(projectId: string, activityId: string): Promise<ProjectSnapshot | null> {
    return this.bucket.get<ProjectSnapshot>(activityId, [this.organization, projectId]);
  }

  async putAsync(projectId: string, activityId: string): Promise<void> {
    const [project, tasks] = await Promise.all([this.projectService.getAsync(projectId), this.taskService.getAllAsync(projectId)]);
    const snapshot: ProjectSnapshot = {
      ...project!,
      tasks,
    };

    this.edge.waitUntil(this.bucket.put(activityId, [this.organization, projectId], snapshot));
  }
}
