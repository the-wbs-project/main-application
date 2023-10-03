import { Context } from '../config';
import { User } from '../models';
import { Logger } from './logger.service';

export class JiraService {
  private readonly logger: Logger;

  constructor(ctx: Context) {
    this.logger = ctx.get('logger');
  }

  async createUploadIssueAsync(ctx: Context, description: string, user: User): Promise<string> {
    const fullDescription = `User Name: ${user.name}\nUser Email: ${user.email}\nUser Description:\n\n${description}`;

    const bodyData = {
      fields: {
        description: {
          content: [
            {
              content: [
                {
                  text: fullDescription,
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'doc',
          version: 1,
        },
        issuetype: {
          id: '10029',
        },
        //labels: ['bugfix', 'blitz_test'],
        project: {
          key: 'TASKS',
        },
        reporter: {
          id: '557058:7af646c1-161c-4c37-9864-527418b20c10',
        },
        summary: 'Assistance With Uploading WBS',
      },
      update: {},
    };

    console.log(`${ctx.env.JIRA_EMAIL}:${ctx.env.JIRA_API_KEY}`);
    const response = await fetch(`https://${ctx.env.JIRA_DOMAIN}/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        Authorization: this.getAuthHeader(ctx),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    });
    console.log(`Response: ${response.status} ${response.statusText}`);

    const responseBody: any = await response.json();

    if (response.status !== 201) {
      this.logger.trackException('An error occured trying to create a Jira issue.', <Error>responseBody);

      throw new Error('An error occured trying to create a Jira issue.');
    }
    return responseBody.id;
  }

  async attachFileAsync(ctx: Context, issueIdOrKey: string, fileName: string, file: ArrayBuffer): Promise<void> {
    const form = new FormData();

    form.append('file', new Blob([file]), fileName);

    const response = await fetch(`https://${ctx.env.JIRA_DOMAIN}/rest/api/3/issue/${issueIdOrKey}/attachments`, {
      method: 'POST',
      body: form,
      headers: {
        Authorization: this.getAuthHeader(ctx),
        Accept: 'application/json',
        'X-Atlassian-Token': 'no-check',
      },
    });
    console.log(`Response: ${response.status} ${response.statusText}`);
    console.log(await response.text());
  }

  private getAuthHeader(ctx: Context): string {
    return 'Basic ' + btoa(`${ctx.env.JIRA_EMAIL}:${ctx.env.JIRA_API_KEY}`);
  }
}
