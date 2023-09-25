import { Hono } from 'hono';
import { Env, Variables } from './config';
import { cors, kv, kvPurge, kvPurgeOrgs, logger, verifyAdminAsync, verifyJwt, verifyMembership } from './middle';
import { DataServiceFactory, Fetcher, Http, Logger, MailGunService, OriginService } from './services';

export const ORIGIN_PASSES: string[] = ['api/import/:type/:culture', 'api/export/:type/:culture'];

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

//
//  Dependency Injection
//
app.use('*', async (ctx, next) => {
  ctx.set('logger', new Logger(ctx));
  ctx.set('fetcher', new Fetcher(ctx));
  ctx.set('origin', new OriginService(ctx));
  ctx.set('data', new DataServiceFactory(ctx));

  await next();
});
//
// CORS
//
app.use('api/*', logger);
app.use('api/*', cors);
app.options('api/*', (c) => c.text(''));

app.get('api/resources/all/:locale', kv.resources, (ctx) => OriginService.pass(ctx));
app.get('api/lists/:type', kv.lists, OriginService.pass);

app.put('api/resources', kvPurge('RESOURCES'), Http.metadata.putResourcesAsync);
app.put('api/lists/:type', kvPurge('LISTS'), Http.metadata.putListAsync);
app.put('api/checklists', kvPurge('CHECKLISTS'), Http.metadata.putChecklistsAsync);

app.post('api/send', MailGunService.handleHomepageInquiryAsync);
app.get('api/edge-data/clear', Http.misc.clearKvAsync);
//
//  Auth calls
//
app.get('api/checklists', kv.checklists, verifyJwt, OriginService.pass);
app.get('api/activities/topLevel/:topLevelId/:skip/:take', verifyJwt, OriginService.pass);
app.get('api/activities/child/:topLevelId/:childId/:skip/:take', verifyJwt, OriginService.pass);
app.put('api/activities', verifyJwt, OriginService.pass);
app.put('api/activities/projects', verifyJwt, OriginService.pass);

app.get('api/projects/owner/:owner', verifyJwt, verifyMembership, OriginService.pass);
app.put('api/projects/owner/:owner', verifyJwt, verifyMembership, OriginService.pass);
app.get('api/projects/owner/:owner/id/:projectId', verifyJwt, verifyMembership, OriginService.pass);

app.get('api/projects/owner/:owner/id/:projectId/nodes', verifyJwt, verifyMembership, OriginService.pass);
app.put('api/projects/owner/:owner/id/:projectId/nodes', verifyJwt, verifyMembership, OriginService.pass);

//app.get('api/discussions/:owner/:associationId', verifyJwt, verifyMembership, Http.discussions.getAsync);
//app.get('api/discussions/:owner/:associationId/users', verifyJwt, verifyMembership, Http.discussions.getUsersAsync);
//app.get('api/discussions/:owner/:associationId/:id', verifyJwt, verifyMembership, Http.discussions.getAsync);
//app.get('api/discussions/:owner/:associationId/:id/text', verifyJwt, verifyMembership, Http.discussions.getTextAsync);
//app.put('api/discussions/:owner/:id', verifyJwt, Http.discussions.putAsync);
//app.get('api/users/:userId', verifyJwt, authKv(['users', ':userId', 'user']), Http.memberships.passAsync);

app.get('api/roles', verifyJwt, kv.roles, OriginService.pass);
app.get('api/users/:user', verifyJwt, kv.users, OriginService.pass);
app.put('api/users/:user', verifyJwt, kvPurge('USERS|:user'), kvPurgeOrgs, OriginService.pass);
//app.get('api/users/:user/roles', verifyJwt, verifyMyself, Http.users.getRolesAsync);

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

app.get('api/files/:file', verifyJwt, Http.misc.getStaticFileAsync);

for (const path of ORIGIN_PASSES) {
  app.post(path, verifyJwt, OriginService.pass);
}
export default app;
