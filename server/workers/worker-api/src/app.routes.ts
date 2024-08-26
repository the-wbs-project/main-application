import { Hono } from 'hono';
import { Env, Variables } from './config';
import { cors, kv, kvPurge, ddLogger, verifyAdminAsync, verifyJwt, verifyMembership, error } from './middle';
import { DataServiceFactory, Fetcher, Http, JiraService, HttpLogger, MailGunService, OriginService, DataDogService } from './services';
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
  ctx.set('datadog', new DataDogService(ctx.env));
  ctx.set('logger', new HttpLogger(ctx));
  ctx.set('fetcher', new Fetcher(ctx));
  ctx.set('jira', new JiraService(ctx));
  ctx.set('origin', new OriginService(ctx));
  ctx.set('data', new DataServiceFactory(ctx));

  await next();
});
//
// Middleware
//
app.use('*', ddLogger);
app.use('*', cors);
app.onError(error);

app.options('*', (c) => c.text(''));

for (const path of ROUTES.RESOURCE_URLS) {
  app.get(path, OriginService.pass);
  //app.put(path, verifyJwt, verifyMembership, kv.resourceFileClear, OriginService.pass);
}
app.get('api/resources/all/:locale', kv.resources, OriginService.pass);
app.get('api/lists/:type/:locale', kv.lists, Http.metadata.getListsAsync);
//
//  Claims
//
const claimsApp = newApp()
  .basePath('api/claims')
  .use('*', verifyJwt)
  .get('organization/:organization', Http.claims.getForOrganizationAsync)
  .get('project/:owner/:project', Http.claims.getForProjectAsync)
  .get('libraryEntry/:organization/:owner/:entry/:version', Http.claims.getForLibraryEntryAsync);

app.route('/', claimsApp);

app.get('api/cache/clear', Http.misc.clearKvAsync);
app.put('api/resources', kvPurge('RESOURCES'), Http.metadata.putResourcesAsync);
app.put('api/lists/:type', kvPurge('LISTS'), Http.metadata.putListAsync);
app.put('api/checklists', kvPurge('CHECKLISTS'), Http.metadata.putChecklistsAsync);

app.post('api/send', MailGunService.handleHomepageInquiryAsync);
app.get('api/edge-data/clear', Http.misc.clearKvAsync);
//
//  Library calls
//
const libApp = newApp()
  .basePath('api/libraries')
  .use('*', verifyJwt)
  .get('/drafts/:owner/:types', verifyMembership, Http.library.getDraftsAsync)
  .post('internal/:owner', verifyMembership, OriginService.pass)
  .post('public', OriginService.pass);

app.route('/', libApp);
//
//  Auth calls
//
app.get('api/portfolio/:owner/projects/:project/users', verifyJwt, verifyMembership, Http.projects.getUsersAsync);
//
//  Library Entry calls
//
const entryApp = newApp()
  .basePath('api/portfolio/:owner/library/entries/:entry')
  .get('id', verifyJwt, Http.library.getIdAsync)
  .get('versions', verifyJwt, Http.libraryVersions.getAsync)
  .get('versions/:version', verifyJwt, Http.libraryVersions.getByIdAsync)
  .get('versions/:version/nodes/public', verifyJwt, Http.libraryTasks.getPublicAsync)
  .get('versions/:version/nodes/private', verifyJwt, verifyMembership, Http.libraryTasks.getInternalAsync)

  .put('', verifyJwt, Http.libraryEntries.putAsync)
  .put('versions/:version', verifyJwt, Http.libraryVersions.putAsync)
  .put('versions/:version/publish', verifyJwt, Http.libraryVersions.publishAsync)
  .put('versions/:version/replicate', verifyJwt, Http.libraryVersions.publishAsync)
  .put('versions/:version/nodes', verifyJwt, Http.libraryTasks.putAsync);

app.route('/', entryApp);

app.get('api/roles', Http.roles.getAllAsync);
app.get('api/memberships', verifyJwt, Http.users.getMembershipsAsync);
app.get('api/users/:organization/:user', verifyJwt, Http.users.getUserAsync);
app.get('api/site-roles', verifyJwt, Http.users.getSiteRolesAsync);
app.all('api/profile', verifyJwt).get(Http.users.getProfileAsync).put(Http.users.updateAsync);
//app.get('api/users/:user/roles', verifyJwt, verifyMyself, Http.users.getRolesAsync);

const orgApp = new Hono<{ Bindings: Env; Variables: Variables }>().basePath('api/organizations/:organization');

orgApp.use('*', verifyJwt);
orgApp.get('', Http.organizations.getByNameAsync);
orgApp
  .all('invites', verifyMembership, verifyAdminAsync())
  .get(Http.invites.getAllAsync)
  .post(Http.invites.sendAsync)
  .delete(':inviteId', Http.invites.deleteAsync);

orgApp.all('members', verifyMembership).get(Http.membership.getAllAsync);
orgApp.all('members/:user', verifyMembership).delete(Http.membership.deleteAsync);
orgApp.all('members/:user/roles', verifyAdminAsync()).put(Http.membership.addToRolesAsync).delete(Http.membership.deleteFromRolesAsync);

app.route('/', orgApp);
//app.delete('api/organizations/:organization/members/*', kv.membersClear, OriginService.pass);

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

for (const path of ROUTES.VERIFY_JWT_GET) app.get(path, verifyJwt, OriginService.pass);
for (const path of ROUTES.VERIFY_JWT_POST) app.post(path, verifyJwt, OriginService.pass);
for (const path of ROUTES.VERIFY_JWT_PUT) app.put(path, verifyJwt, OriginService.pass);
for (const path of ROUTES.VERIFY_JWT_DELETE) app.delete(path, verifyJwt, OriginService.pass);

for (const path of ROUTES.VERIFY_JWT_MEMBERSHIP_GET) app.get(path, verifyJwt, verifyMembership, OriginService.pass);
for (const path of ROUTES.VERIFY_JWT_MEMBERSHIP_POST) app.post(path, verifyJwt, verifyMembership, OriginService.pass);
for (const path of ROUTES.VERIFY_JWT_MEMBERSHIP_PUT) app.put(path, verifyJwt, verifyMembership, OriginService.pass);
for (const path of ROUTES.VERIFY_JWT_MEMBERSHIP_DELETE) app.delete(path, verifyJwt, verifyMembership, OriginService.pass);

export const APP_ROUTES = app;
