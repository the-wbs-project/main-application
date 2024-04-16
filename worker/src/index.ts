import { Hono } from 'hono';
import { Env, Variables } from './config';
import { cors, kv, kvPurge, kvPurgeOrgs, ddLogger, verifyAdminAsync, verifyJwt, verifyMembership, indexLibrary } from './middle';
import { DataServiceFactory, Fetcher, Http, JiraService, HttpLogger, MailGunService, OriginService, DataDogService } from './services';
import * as ROUTE_FILE from './routes.json';
import { Routes } from './models';

const ROUTES: Routes = ROUTE_FILE;
const app = new Hono<{ Bindings: Env; Variables: Variables }>();
//
//  Dependency Injection
//
app.use('*', async (ctx, next) => {
  ctx.set('datadog', new DataDogService(ctx.env));
  ctx.set('logger', new HttpLogger(ctx));
  ctx.set('fetcher', new Fetcher(ctx));
  ctx.set('jira', new JiraService(ctx));
  ctx.set('origin', new OriginService(ctx));
  ctx.set('data', new DataServiceFactory(ctx));

  await next();
});
//
// CORS
//
app.use('*', ddLogger);
app.use('*', cors);
app.onError((err, ctx) => {
  ctx.get('logger').trackException('An uncaught error occured trying to process a request.', <Error>err);

  return ctx.text('Unexpected Error', { status: 500 });
});

app.options('api/*', cors, (c) => c.text(''));

app.get('api/resources/all/:locale', kv.resources, OriginService.pass);
app.get('api/lists/:type', kv.lists, OriginService.pass);
app.get('api/roles', async (ctx) => ctx.json(await ctx.get('data').roles.getAsync()));

app.get('api/claims/organization/:organization', verifyJwt, Http.claims.getForOrganizationAsync);
app.get('api/claims/project/:owner/:project', verifyJwt, Http.claims.getForProjectAsync);
app.get('api/claims/libraryEntry/:owner/:entry', verifyJwt, Http.claims.getForLibraryEntryAsync);

app.put('api/resources', kvPurge('RESOURCES'), Http.metadata.putResourcesAsync);
app.put('api/lists/:type', kvPurge('LISTS'), Http.metadata.putListAsync);
app.put('api/checklists', kvPurge('CHECKLISTS'), Http.metadata.putChecklistsAsync);

app.post('api/send', MailGunService.handleHomepageInquiryAsync);
app.get('api/edge-data/clear', Http.misc.clearKvAsync);
//
//  Auth calls
//
app.get('api/portfolio/:owner/projects/:project/users', verifyJwt, verifyMembership, Http.projects.getUsersAsync);
app.post('api/portfolio/:owner/projects/:projectId/export/libraryEntry', verifyJwt, Http.libraryExport.postAsync);
app.post('api/portfolio/:owner/projects/:projectId/nodes/:nodeId/export/libraryEntry', verifyJwt, Http.libraryExport.postAsync);

app.get('api/portfolio/:owner/library/entries', verifyJwt, verifyMembership, Http.libraryEntries.getListAsync);

app.put('api/portfolio/:owner/library/entries/:entryId', verifyJwt, verifyMembership, indexLibrary, OriginService.pass);
app.put('api/portfolio/:owner/library/entries/:entryId/*', verifyJwt, verifyMembership, indexLibrary, OriginService.pass);

app.get('api/roles', verifyJwt, kv.roles, OriginService.pass);
app.get('api/users/:user', verifyJwt, kv.users, OriginService.pass);
app.put('api/users/:user', verifyJwt, kvPurge('USERS|:user'), kvPurgeOrgs, OriginService.pass);
//app.get('api/users/:user/roles', verifyJwt, verifyMyself, Http.users.getRolesAsync);

app.get('api/organizations/:organization', verifyJwt, Http.organizations.getByNameAsync);
app.get('api/organizations/:organization/members', verifyJwt, verifyMembership, kv.members, OriginService.pass);
app.get('api/organizations/:organization/invites', verifyJwt, verifyMembership, verifyAdminAsync(), OriginService.pass);
app.post('api/organizations/:organization/invites', verifyJwt, verifyMembership, verifyAdminAsync(), OriginService.pass);
app.delete('api/organizations/:organization/invites/:inviteId', verifyJwt, verifyMembership, verifyAdminAsync(), OriginService.pass);
app.put(
  'api/organizations/:organization/members/:user/roles',
  verifyJwt,
  verifyMembership,
  verifyAdminAsync(),
  kvPurge('ORGS|:organization|MEMBERS'),
  OriginService.pass,
);
app.delete(
  'api/organizations/:organization/members/:user/roles',
  verifyJwt,
  verifyMembership,
  verifyAdminAsync(),
  kvPurge('ORGS|:organization|MEMBERS'),
  OriginService.pass,
);

app.delete('api/organizations/:organization/members', kv.membersClear, (ctx) => ctx.newResponse('', { status: 204 }));

app.get('api/chat/:model', verifyJwt, Http.aiChat.getAsync);
app.put('api/chat/:model', verifyJwt, Http.aiChat.putAsync);
app.delete('api/chat/:model', verifyJwt, Http.aiChat.deleteAsync);

app.get('api/chat/thread/:threadId/comments/skip/:skip/take/:take', verifyJwt, Http.chat.getAsync);
app.post('api/chat/thread/:threadId', verifyJwt, Http.chat.postAsync);

app.post('api/jira/upload/create', verifyJwt, Http.jira.createUploadIssueAsync);
app.post('api/jira/upload/:jiraIssueId/attachment', verifyJwt, Http.jira.uploadAttachmentAsync);

app.get('api/files/statics/:file', verifyJwt, Http.statics.getAsync);

app.get('api/portfolio/:owner/files/:file', verifyJwt, Http.resourceFiles.getAsync);
app.put('api/portfolio/:owner/files/:file', verifyJwt, Http.resourceFiles.putAsync);

app.get('api/queue/test', (ctx) => {
  ctx.env.JIRA_SYNC_QUEUE.send({
    message: 'Hello World!',
  });
  return ctx.text('OK');
});

for (const path of ROUTES.VERIFY_JWT_GET) app.get(path, verifyJwt, OriginService.pass);
for (const path of ROUTES.VERIFY_JWT_POST) app.post(path, verifyJwt, OriginService.pass);

for (const path of ROUTES.VERIFY_JWT_MEMBERSHIP_GET) app.get(path, verifyJwt, verifyMembership, OriginService.pass);
for (const path of ROUTES.VERIFY_JWT_MEMBERSHIP_POST) app.post(path, verifyJwt, verifyMembership, OriginService.pass);
for (const path of ROUTES.VERIFY_JWT_MEMBERSHIP_PUT) app.put(path, verifyJwt, verifyMembership, OriginService.pass);

export default app;
/*
export default {
  fetch: app.fetch,
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    //
  },
  async queue(batch: MessageBatch, env: Env, ctx: ExecutionContext): Promise<void> {

    const datadog = new DataDogService(env);
    const logger = new JobLogger(env, datadog, batch.queue);

    try {
      if (batch.queue.startsWith('wbs-jira-sync')) {
        const message = batch.messages[0];

        batch.ackAll();
        logger.trackEvent('Executed ' + batch.queue, 'Info', <any>message.body);
      }
    } catch (e) {
      logger.trackException('An error occured trying to process a queue message.', <Error>e);
    } finally {
      ctx.waitUntil(datadog.flush());
    }
  },
};
*/
