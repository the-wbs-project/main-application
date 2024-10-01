import { Env } from '../config';
import { User } from '../models';
import { Fetcher } from './fetcher.service';
import { Logger } from './logging';

export class JiraService {
  constructor(private readonly env: Env, private readonly fetcher: Fetcher, private readonly logger: Logger) {}

  async createUploadIssueAsync(description: string, organization: string, user: User): Promise<string> {
    const bodyData = {
      fields: {
        description: {
          content: [
            {
              content: [
                {
                  text: description,
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
        project: {
          key: 'TASKS',
        },
        reporter: {
          id: '712020:e703d1b3-929f-4939-8b5e-25c72985fccd',
        },
        customfield_10048: user.name,
        customfield_10049: user.email,
        customfield_10050: organization,
        summary: 'Assistance With Uploading WBS - ' + user.email,
      },
      update: {},
    };

    const response = await this.fetcher.fetch(`https://${this.env.JIRA_DOMAIN}/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        Authorization: this.getAuthHeader(),
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

  async attachFileAsync(issueIdOrKey: string, fileName: string, file: ArrayBuffer): Promise<void> {
    const form = new FormData();

    form.append('file', new Blob([file]), fileName);

    const response = await this.fetcher.fetch(`https://${this.env.JIRA_DOMAIN}/rest/api/3/issue/${issueIdOrKey}/attachments`, {
      method: 'POST',
      body: form,
      headers: {
        Authorization: this.getAuthHeader(),
        Accept: 'application/json',
        'X-Atlassian-Token': 'no-check',
      },
    });
    //console.log(`Response: ${response.status} ${response.statusText}`);
    const responseBody: any = await response.json();

    if (response.status !== 200) {
      this.logger.trackException('An error occured trying to attach a file to a Jira issue.', <Error>responseBody);

      throw new Error('An error occured trying to attach a file to a Jira issue.');
    }
  }

  private getAuthHeader(): string {
    return 'Basic ' + btoa(`${this.env.JIRA_EMAIL}:${this.env.JIRA_API_KEY}`);
  }
}
