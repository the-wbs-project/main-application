import { Context } from '../../config';
import { Activity, Organization, Project, UserProfile } from '../../models';

export class ProjectActivitiesService {
  private owner!: string;
  private projectId!: string;

  private project?: Project;
  private organization?: Organization;
  private users = new Map<string, UserProfile>();

  async processAsync(ctx: Context, owner: string, projectId: string, activities: Activity[]) {
    this.owner = owner;
    this.projectId = projectId;

    const project = await ctx.var.data.projects.getByIdAsync(owner, projectId);
    const organization = await ctx.var.data.organizations.getByIdAsync(owner);
    //let users = new Map<string, UserProfile>();
  }

  private async getProjectAsync(ctx: Context): Promise<Project> {
    if (!this.project) this.project = await ctx.var.data.projects.getByIdAsync(this.owner, this.projectId);

    return this.project!;
  }

  private async getOrganizationAsync(ctx: Context): Promise<Organization> {
    if (!this.organization) this.organization = await ctx.var.data.organizations.getByIdAsync(this.owner);

    return this.organization!;
  }

  private static async checkActivitiesForEmails(ctx: Context, owner: string, projectId: string, activities: Activity[]) {
    const project = await ctx.var.data.projects.getByIdAsync(owner, projectId);
    const organization = await ctx.var.data.organizations.getByIdAsync(owner);
    let users = new Map<string, UserProfile>();

    for (const activity of activities) {
      if (activity.action === PROJECT_ACTIONS.ADDED_USER) {
        const userId = activity.data.user;
        const role = activity.data.role;
        let user: UserProfile | undefined;

        if (users.has(userId)) {
          user = users.get(userId);
        } else {
          user = await ctx.var.data.users.getUserAsync(userId);
          users.set(userId, user);
        }
        await ctx.env.PROJECT_ASSIGNMENT_QUEUE.send({
          role,
          user: user!,
          assignment: 'added',
          organizationName: organization!.name,
          projectName: project!.title,
          link: `${ctx.env.SITE_URL}/portfolio/${owner}/projects/${projectId}`,
        });
        /*{
  role: roleTitle,
  user: user.userId,
  userName: user.fullName,
}*/
        //
      } else if (activity.action === PROJECT_ACTIONS.REMOVED_USER) {
        //
      }
    }
    //
  }
}
