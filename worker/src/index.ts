import { Hono } from 'hono';
import { Env, Variables } from './config';
import { cache, cachePurge, cors, logger, verifyJwt, verifyMembership, verifyMembershipRole } from './middle';
import { DataServiceFactory, Fetcher, Http, Logger, MailGunService, OriginService } from './services';
import { ROLES } from './models';

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
app.use('*', logger);
app.use('*', cors);

app.options('*', (c) => c.text(''));

app.get('api/resources/all/:locale', cache, (ctx) => OriginService.pass(ctx));
app.get('api/lists/:type', cache, OriginService.pass);

app.put('api/resources', cachePurge, Http.metadata.setResourcesAsync);
app.put('api/lists/:type', cachePurge, Http.metadata.putListAsync);

app.post('api/send', MailGunService.handleHomepageInquiryAsync);
app.get('api/edge-data/clear', Http.misc.clearKvAsync);
//
//  Auth calls
//
app.get('api/checklists', verifyJwt, Http.checklists.getAsync);
app.get('api/activity/topLevel/:topLevelId/:skip/:take', verifyJwt, Http.activities.getByIdAsync);
app.get('api/activity/child/:topLevelId/:childId/:skip/:take', verifyJwt, Http.activities.getByIdAsync);
app.get('api/activity/user/:userId', verifyJwt, Http.activities.getByUserIdAsync);
app.put('api/activity', verifyJwt, Http.activities.putAsync);
app.get('api/projects/:owner/all', verifyJwt, verifyMembership, Http.projects.getAllAsync);
app.get('api/projects/:owner/byId/:projectId', verifyJwt, verifyMembership, cache, Http.projects.getByIdAsync);
app.put('api/projects/:owner/byId/:projectId', verifyJwt, verifyMembership, Http.projects.putAsync);
app.get('api/projects/:owner/byId/:projectId/nodes', verifyJwt, verifyMembership, Http.projectNodes.getAsync);
app.put('api/projects/:owner/byId/:projectId/nodes/batch', verifyJwt, verifyMembership, Http.projectNodes.batchAsync);
app.put('api/projects/:owner/byId/:projectId/nodes/:nodeId', verifyJwt, verifyMembership, Http.projectNodes.putAsync);
app.get('api/projects/:owner/byId/:projectId/users', verifyJwt, verifyMembership, Http.projectNodes.getAsync);
app.get('api/projects/:owner/snapshot/:projectId/:activityId', verifyJwt, verifyMembership, Http.projectSnapshots.getByActivityIdAsync);
app.put('api/projects/:owner/snapshot/:projectId/:activityId', verifyJwt, verifyMembership, Http.projectSnapshots.take);
app.get('api/discussions/:owner/:associationId', verifyJwt, verifyMembership, Http.discussions.getAsync);
app.get('api/discussions/:owner/:associationId/users', verifyJwt, verifyMembership, Http.discussions.getUsersAsync);
app.get('api/discussions/:owner/:associationId/:id', verifyJwt, verifyMembership, Http.discussions.getAsync);
app.get('api/discussions/:owner/:associationId/:id/text', verifyJwt, verifyMembership, Http.discussions.getTextAsync);
//app.put('api/discussions/:owner/:id', verifyJwt, Http.discussions.putAsync);
app.get('api/memberships', verifyJwt, Http.memberships.getMembershipsAsync);
app.get('api/roles', verifyJwt, Http.memberships.getRolesAsync);
app.get('api/users/:userId', verifyJwt, Http.memberships.getUserAsync);
app.get('api/memberships/:organization/roles', verifyJwt, verifyMembership, Http.memberships.getMembershipRolesAsync);
app.get('api/memberships/:organization/users', verifyJwt, verifyMembership, Http.memberships.getMembershipUsersAsync);
app.delete(
  'api/memberships/:organization/users/:userId',
  verifyJwt,
  verifyMembershipRole(ROLES.ADMIN),
  Http.memberships.removeUserFromOrganizationAsync,
);
app.post(
  'api/memberships/:organization/users/:userId/roles',
  verifyJwt,
  verifyMembershipRole(ROLES.ADMIN),
  Http.memberships.addUserOrganizationalRolesAsync,
);
app.delete(
  'memberships/:organization/users/:userId/roles',
  verifyJwt,
  verifyMembershipRole(ROLES.ADMIN),
  Http.memberships.removeUserOrganizationalRolesAsync,
);
app.get('files/:file', verifyJwt, Http.misc.getStaticFileAsync);

for (const path of ORIGIN_PASSES) {
  app.post(path, verifyJwt, OriginService.pass);
}
export default app;
