import { Context } from '../../config';

export class JiraHttpService {
  static async createUploadIssueAsync(ctx: Context): Promise<Response> {
    try {
      const { description, organization, user } = await ctx.req.json();

      const issueId = await ctx.get('jira').createUploadIssueAsync(ctx, description, organization, user);

      return ctx.text(issueId);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to create upload issue JIRA ticket.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async uploadAttachmentAsync(ctx: Context): Promise<Response> {
    try {
      const { jiraIssueId } = await ctx.req.param();

      const fileName = ctx.req.raw.headers.get('x-filename')!; // could I guess be based on a wildcard route too: /uploads/cat.png
      const file = await ctx.req.arrayBuffer();

      await ctx.get('jira').attachFileAsync(ctx, jiraIssueId, fileName, file);

      return ctx.text('', 204);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to create upload an attachment to JIRA issue.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
