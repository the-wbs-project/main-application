import { Hono } from 'hono';
import { Env, Variables } from './config';
import { cache, cors, logger, verifyJwt, verifyMembership } from './middle';
import { DataServiceFactory, Fetcher, Http, Logger, MailGunService } from './services';

export const AZURE_ROUTES_POST: string[] = ['/api/projects/export/:type', '/api/projects/import/*'];

const app = new Hono<{ Bindings: Env; Variables: Variables }>();
//
//  Dependency Injection
//
app.use('*', async (ctx, next) => {
  ctx.set('logger', new Logger(ctx));
  ctx.set('fetcher', new Fetcher(ctx));
  ctx.set('data', new DataServiceFactory(ctx));

  await next();
});
//
// CORS
//
app.use('*', logger);
app.use('*', cors);

app.options('*', (c) => c.text(''));

app.get('/api/resources', cache, Http.metadata.getResourcesAsync);
app.get('/api/lists/:name', cache, Http.metadata.getListAsync);
app.post('/api/send', MailGunService.handleHomepageInquiryAsync);

app.get('/api/invites/preReg/:owner/:code', Http.invites.getEmailAsync);
app.get('/api/invites/postReg/:owner/:code', Http.invites.getAndAcceptAsync);
//app.get('/api/resources/Info', Http.metadata.setInfo, Http.metadata.getResourcesAsync);
app.get('/api/edge-data/clear', Http.misc.clearKvAsync);
//
//  Auth calls
//
app.get('/api/invites', verifyJwt, Http.invites.getAllAsync);
app.put('/api/invites/:send', verifyJwt, Http.invites.putAsync);
app.get('/api/checklists', verifyJwt, Http.checklists.getAsync);
app.get('/api/activity/:topLevelId/:skip/:take', verifyJwt, Http.activities.getByIdAsync);
app.get('/api/activity/user/:userId', verifyJwt, verifyMembership, Http.activities.getByUserIdAsync);
app.put('/api/activity/:dataType', verifyJwt, verifyMembership, Http.activities.putAsync);
app.get('/api/projects/:owner/all', verifyJwt, verifyMembership, Http.projects.getAllAsync);
app.get('/api/projects/:owner/byId/:projectId', verifyJwt, verifyMembership, cache, Http.projects.getByIdAsync);
app.put('/api/projects/:owner/byId/:projectId', verifyJwt, verifyMembership, Http.projects.putAsync);
app.get('/api/projects/:owner/byId/:projectId/nodes', verifyJwt, verifyMembership, Http.projectNodes.getAsync);
app.put('/api/projects/:owner/byId/:projectId/nodes/batch', verifyJwt, verifyMembership, Http.projectNodes.batchAsync);
app.put('/api/projects/:owner/byId/:projectId/nodes/:nodeId', verifyJwt, verifyMembership, Http.projectNodes.putAsync);
app.get('/api/projects/:owner/byId/:projectId/users', verifyJwt, verifyMembership, Http.projectNodes.getAsync);
app.get('/api/projects/:owner/snapshot/:projectId/:activityId', verifyJwt, verifyMembership, Http.projectSnapshots.getByActivityIdAsync);
app.get('/api/discussions/:owner/:associationId', verifyJwt, verifyMembership, Http.discussions.getAsync);
app.get('/api/discussions/:owner/:associationId/users', verifyJwt, verifyMembership, Http.discussions.getUsersAsync);
app.get('/api/discussions/:owner/:associationId/:id', verifyJwt, verifyMembership, Http.discussions.getAsync);
app.get('/api/discussions/:owner/:associationId/:id/text', verifyJwt, verifyMembership, Http.discussions.getTextAsync);
//app.put('/api/discussions/:owner/:id', verifyJwt, Http.discussions.putAsync);
app.get('/api/memberships', verifyJwt, Http.memberships.getMembershipsAsync);
app.get('/api/roles', verifyJwt, Http.memberships.getRolesAsync);
app.get('/api/memberships/:organization/roles', verifyJwt, verifyMembership, Http.memberships.getMembershipRolesAsync);
app.get('/api/memberships/:organization/users', verifyJwt, verifyMembership, Http.memberships.getMembershipUsersAsync);
app.get('/api/files/:file', verifyJwt, Http.misc.getStaticFileAsync);

for (const path of AZURE_ROUTES_POST) {
  app.post(path, verifyJwt, Http.misc.handleAzureCallAsync);
}
export default app;

/*
export default {
  async scheduled(event: any, environment: any, context: ExecutionContext) {
    const config = new EnvironmentConfig(environment);
    const keys = await config.kvAuth.list();
    const deleteAt = new Date(new Date().getTime() + 25 * 24 * 60 * 60 * 1000);

    for (const key of keys.keys) {
      if (!key.expiration) {
        await config.kvAuth.delete(key.name);
      } else {
        const expires = new Date(key.expiration * 1000);

        if (expires < deleteAt) {
          //
          //  ok time wise qualifies, check the value
          //
          const value = await config.kvAuth.get(key.name);

          if (value === '{}') {
            await config.kvAuth.delete(key.name);
          }
        }
      }
    }
  },
};
*/
