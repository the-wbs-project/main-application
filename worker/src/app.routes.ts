import { Hono } from 'hono';
import { Env, Variables } from './config';
import { cors, kvPurge, ddLogger, verifyAdminAsync, verifyJwt, verifyMembership, error, verifySiteAdmin } from './middle';
import {
  ClaimsService,
  DataDogService,
  DataServiceFactory,
  Fetcher,
  Http,
  HttpLogger,
  JiraService,
  HttpOriginService,
  MailBuilderService,
  MailGunService,
} from './services';
import * as ROUTE_FILE from './routes.json';
import { Routes } from './models';

function newApp() {
  return new Hono<{ Bindings: Env; Variables: Variables }>();
}

const ROUTES: Routes = ROUTE_FILE;
const app = newApp();
//
//  Dependency Injection
//
app.use('*', async (ctx, next) => {
  var datadog = new DataDogService(ctx.env);
  var logger = new HttpLogger(ctx);
  var fetcher = new Fetcher(logger);
  var origin = new HttpOriginService(ctx);
  var data = new DataServiceFactory(ctx.env, ctx.executionCtx, origin);
  var claims = new ClaimsService(data);
  var jira = new JiraService(ctx.env, fetcher, logger);
  var mailgun = new MailGunService(ctx.env, fetcher, logger);
  var mailBuilder = new MailBuilderService(data, ctx.env, mailgun);

  ctx.set('datadog', datadog);
  ctx.set('logger', logger);
  ctx.set('fetcher', fetcher);
  ctx.set('jira', jira);
  ctx.set('origin', origin);
  ctx.set('claims', claims);
  ctx.set('data', data);
  ctx.set('mailBuilder', mailBuilder);
  ctx.set('mailgun', mailgun);

  await next();
});
//
// Middleware
//
app.use('*', ddLogger);
app.use('*', cors);
app.onError(error);

app.options('*', (c) => c.text(''));

app.get('api/startup', Http.metadata.getStarterKitAsync);
app.get('api/wakeup', Http.metadata.wakeUpAsync);
app.get('api/lists/:type/:locale', Http.metadata.getListsAsync);
//
//  AI models
//
app.get('api/ai/models/text', verifyJwt, Http.ai.getModelsAsync);
app.post('api/ai/run/worker-ai', verifyJwt, Http.ai.runWorkerAiAsync);
app.post('api/ai/run/open-ai', verifyJwt, Http.ai.runOpenAiAsync);

//
//  Claims
//
const claimsApp = newApp()
  .basePath('api/claims')
  .use('*', verifyJwt)
  .get('organization/:organization', Http.claims.getForOrganizationAsync);

app.route('/', claimsApp);

app.get('api/cache/clear', Http.misc.clearKvAsync);
app.put('api/resources', Http.metadata.putResourcesAsync);
app.put('api/lists/:type', Http.metadata.putListAsync);
app.put('api/checklists', kvPurge('CHECKLISTS'), Http.metadata.putChecklistsAsync);

//app.get('api/mailgun/template/:templateId/:version', (ctx) => ctx.var.mailgun.getTemplate(ctx));
app.post('api/send', (ctx) => ctx.var.mailBuilder.handleHomepageInquiryAsync(ctx));
app.get('api/edge-data/clear', Http.misc.clearKvAsync);

app.get('api/tools/rebuild', verifyJwt, verifySiteAdmin, HttpOriginService.pass);
app.get('api/tools/rebuild/:organization', verifyJwt, verifySiteAdmin, HttpOriginService.pass);

app.get('api/activities/topLevel/:owner/:topLevel/:skip/:take', verifyJwt, verifyMembership, Http.activities.getAsync);
app.post('api/activities', verifyJwt, Http.activities.postAsync);
//
//  Library calls
//
const libApp = newApp()
  .basePath('api/libraries')
  .get('drafts/:owner/:types', verifyJwt, verifyMembership, Http.library.getDraftsAsync)
  .post('internal/:owner', verifyJwt, verifyMembership, HttpOriginService.pass)
  .post('public', verifyJwt, HttpOriginService.pass);

app.route('/', libApp);
//
//  Library Entry calls
//
const entryApp = newApp()
  .basePath('api/portfolio/:owner/library/entries/:entry')
  .get('id', verifyJwt, Http.library.getIdAsync)
  .get('recordId', verifyJwt, Http.library.getRecordIdAsync)
  .get('versions/:version/:visibility', verifyJwt, Http.libraryEntries.getVersionByIdAsync)

  .put('', verifyJwt, Http.libraryEntries.putEntryAsync)
  .put('versions/:version', verifyJwt, Http.libraryEntries.putVersionAsync)
  .put('versions/:version/publish', verifyJwt, Http.libraryEntries.putVersionAsync)
  .put('versions/:version/replicate', verifyJwt, Http.libraryEntries.putVersionAsync)
  .put('versions/:version/nodes', verifyJwt, Http.libraryEntries.putTasksAsync);

app.route('/', entryApp);
//
//
//  Project calls
//
const projectApp = newApp()
  .basePath('api/portfolio/:owner/projects')
  .get('', verifyJwt, verifyMembership, Http.projects.getByOwnerAsync)
  .get(':project', verifyJwt, verifyMembership, Http.projects.getByIdAsync)
  .get(':project/id', verifyJwt, verifyMembership, Http.projects.getIdAsync)
  .get(':project/recordId', verifyJwt, verifyMembership, Http.projects.getRecordIdAsync)
  .get(':project/nodes', verifyJwt, verifyMembership, Http.projects.getNodesAsync)
  .put(':project', verifyJwt, verifyMembership, Http.projects.putProjectAsync)
  .post(':project/activities', verifyJwt, verifyMembership, Http.projectActivities.postAsync)
  .delete(':project', verifyJwt, verifyMembership, Http.projects.deleteProjectAsync)
  .put(':project/nodes', verifyJwt, verifyMembership, Http.projects.putNodesAsync);
//.put(':project/approvals', verifyJwt, verifyMembership, Http.projects.putAsync);

app.route('/', projectApp);

//
//  Invites
//
app.get('api/invites/:organization/includeAll/:includeAll', verifyJwt, verifyAdminAsync, Http.invites.getAsync);
app.post('api/invites/:organization/:inviteId/resend', verifyJwt, verifyAdminAsync, Http.invites.resendAsync);
app.post('api/invites/:organization', verifyJwt, verifyAdminAsync, Http.invites.postAsync);
app.put('api/invites/:organization/:inviteId', verifyJwt, verifyAdminAsync, Http.invites.putAsync);
app.delete('api/invites/:organization/:inviteId', verifyJwt, verifyAdminAsync, Http.invites.deleteAsync);
//
//  Onboarding (no auth)
//
app.get('api/onboard/:organization/:inviteId', Http.onboard.getAsync);
app.post('api/onboard/:organization/:inviteId', Http.onboard.postAsync);
//
//  Organization calls
//
app.get('api/members/migrate', HttpOriginService.pass); //no JWT, but should have low rate limits
app.get('api/members/setup', Http.members.setupAsync); //no JWT, but should have low rate limits
app.get('api/memberships', verifyJwt, Http.members.getMembershipsAsync);
app.get('api/profile', verifyJwt, Http.users.getProfileAsync);
app.put('api/profile', verifyJwt, Http.users.updateAsync);
app.get('api/site-roles', verifyJwt, Http.members.getSiteRolesAsync);
//app.get('api/users/:user/roles', verifyJwt, verifyMyself, Http.users.getRolesAsync);

app.get('api/members/:organization', verifyJwt, verifyMembership, Http.members.getAllAsync);
app.put('api/members/:organization/users/:userId/roles', verifyJwt, verifyAdminAsync, Http.members.putAsync);

//
//
//  Content Resources
//
const contentResourceApp = newApp()
  .basePath('api/portfolio/:owner/content-resources')
  .get(':parentId', verifyJwt, verifyMembership, Http.contentResources.getListAsync)
  .get(':parentId/resource/:id/file', verifyJwt, Http.contentResources.getFileAsync)
  .put(':parentId/resource/:id', verifyJwt, verifyMembership, Http.contentResources.putOrDeleteAsync)
  .put(':parentId/resource/:id/file', verifyJwt, verifyMembership, Http.contentResources.putOrDeleteAsync)
  .delete(':parentId/resource/:id', verifyJwt, verifyMembership, Http.contentResources.putOrDeleteAsync);

app.route('/', contentResourceApp);

app.get('api/chat/:model', verifyJwt, Http.aiChat.getAsync);
app.put('api/chat/:model', verifyJwt, Http.aiChat.putAsync);
app.delete('api/chat/:model', verifyJwt, Http.aiChat.deleteAsync);

//app.get('api/chat/thread/:threadId/comments/skip/:skip/take/:take', verifyJwt, Http.chat.getAsync);
//app.post('api/chat/thread/:threadId', verifyJwt, Http.chat.postAsync);

app.post('api/jira/upload/create', verifyJwt, Http.jira.createUploadIssueAsync);
app.post('api/jira/upload/:jiraIssueId/attachment', verifyJwt, Http.jira.uploadAttachmentAsync);

app.get('api/queue/test', (ctx) => {
  ctx.env.JIRA_SYNC_QUEUE.send({
    message: 'Hello World!',
  });
  return ctx.text('OK');
});

for (const path of ROUTES.VERIFY_JWT_GET) app.get(path, verifyJwt, HttpOriginService.pass);
for (const path of ROUTES.VERIFY_JWT_POST) app.post(path, verifyJwt, HttpOriginService.pass);
for (const path of ROUTES.VERIFY_JWT_PUT) app.put(path, verifyJwt, HttpOriginService.pass);
for (const path of ROUTES.VERIFY_JWT_DELETE) app.delete(path, verifyJwt, HttpOriginService.pass);

for (const path of ROUTES.VERIFY_JWT_MEMBERSHIP_GET) app.get(path, verifyJwt, verifyMembership, HttpOriginService.pass);
for (const path of ROUTES.VERIFY_JWT_MEMBERSHIP_POST) app.post(path, verifyJwt, verifyMembership, HttpOriginService.pass);
for (const path of ROUTES.VERIFY_JWT_MEMBERSHIP_PUT) app.put(path, verifyJwt, verifyMembership, HttpOriginService.pass);
for (const path of ROUTES.VERIFY_JWT_MEMBERSHIP_DELETE) app.delete(path, verifyJwt, verifyMembership, HttpOriginService.pass);

app.get('/api/*', (x) => x.text('Not Found', 404)); // OriginService.pass);
app.put('/api/*', (x) => x.text('Not Found', 404)); // OriginService.pass);
app.post('/api/*', (x) => x.text('Not Found', 404)); // OriginService.pass);
app.delete('/api/*', (x) => x.text('Not Found', 404)); // OriginService.pass);

export const API_ROUTES = app;
