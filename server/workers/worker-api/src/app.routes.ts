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
  MailGunService,
  HttpOriginService,
  MailBuilderService,
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
  var mailbuilder = new MailBuilderService(data, ctx.env, mailgun);

  ctx.set('datadog', datadog);
  ctx.set('logger', logger);
  ctx.set('fetcher', fetcher);
  ctx.set('jira', jira);
  ctx.set('origin', origin);
  ctx.set('claims', claims);
  ctx.set('data', data);
  ctx.set('mailgun', mailgun);
  ctx.set('mailBuilder', mailbuilder);
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
  .put('versions/:version/publish', verifyJwt, Http.libraryEntries.publishVersionAsync)
  .put('versions/:version/replicate', verifyJwt, Http.libraryEntries.putVersionAsync)
  .put('versions/:version/nodes', verifyJwt, Http.libraryEntries.putTasksAsync);

app.route('/', entryApp);
//
// Watchers
//
const watcherApp = newApp()
  .get('entries', verifyJwt, Http.watchers.getWatchedAsync)
  .get('users/:owner/:id', verifyJwt, Http.watchers.getWatchersAsync)
  .get('users/:owner/:id/count', verifyJwt, Http.watchers.getWatcherCountAsync);

app.route('api/watchers', watcherApp);
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
  .put(':project/create', verifyJwt, verifyMembership, Http.projects.createProjectAsync)
  .delete(':project', verifyJwt, verifyMembership, Http.projects.deleteProjectAsync)
  .put(':project/nodes', verifyJwt, verifyMembership, Http.projects.putNodesAsync);
//.put(':project/approvals', verifyJwt, verifyMembership, Http.projects.putAsync);

app.route('/', projectApp);

//
//  Organization calls
//
app.get('api/roles', Http.roles.getAllAsync);
app.get('api/memberships', verifyJwt, Http.users.getMembershipsAsync);
app.get('api/users/:organization/:user', verifyJwt, Http.users.getUserAsync);
app.get('api/site-roles', verifyJwt, Http.users.getSiteRolesAsync);
app.all('api/profile', verifyJwt).get(Http.users.getProfileAsync).put(Http.users.updateAsync);
//app.get('api/users/:user/roles', verifyJwt, verifyMyself, Http.users.getRolesAsync);

const orgApp = new Hono<{ Bindings: Env; Variables: Variables }>().basePath('api/organizations/:organization');

orgApp.get('', verifyJwt, Http.organizations.getByNameAsync);
orgApp.get('invites', verifyJwt, verifyMembership, verifyAdminAsync(), Http.invites.getAllAsync);
orgApp.post('invites', verifyJwt, verifyMembership, verifyAdminAsync(), Http.invites.sendAsync);
orgApp.delete('invites/:inviteId', verifyJwt, verifyMembership, verifyAdminAsync(), Http.invites.deleteAsync);

orgApp.all('members', verifyJwt, verifyMembership).get(Http.membership.getAllAsync);
orgApp.all('members/:user', verifyJwt, verifyMembership).delete(Http.membership.deleteAsync);
orgApp
  .all('members/:user/roles', verifyJwt, verifyAdminAsync())
  .put(Http.membership.addToRolesAsync)
  .delete(Http.membership.deleteFromRolesAsync);

app.route('/', orgApp);
//app.delete('api/organizations/:organization/members/*', kv.membersClear, OriginService.pass);

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

app.get('api/chat/thread/:threadId/comments/skip/:skip/take/:take', verifyJwt, Http.chat.getAsync);
app.post('api/chat/thread/:threadId', verifyJwt, Http.chat.postAsync);

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

app.get('/api/*', verifyJwt, (x) => x.text('Not Found', 404)); // OriginService.pass);
app.put('/api/*', verifyJwt, (x) => x.text('Not Found', 404)); // OriginService.pass);
app.post('/api/*', verifyJwt, (x) => x.text('Not Found', 404)); // OriginService.pass);
app.delete('/api/*', verifyJwt, (x) => x.text('Not Found', 404)); // OriginService.pass);

export const API_ROUTES = app;
