import { Hono } from 'hono';
import { Env, Variables } from './config';
import { cache, cors, isAdmin, logger, verify } from './middle';
import { DataServiceFactory, Fetcher, Http, Logger, MailGunService } from './services';

export const AZURE_ROUTES_POST: string[] = ['api/projects/export/*', 'api/projects/import/*'];

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

app.get('/api/resources/:category', cache, Http.metadata.getResourcesAsync);
app.get('/api/lists/:name', cache, Http.metadata.getListAsync);
app.post('/api/send', MailGunService.handleHomepageInquiryAsync);

app.get('/api/invites', verify, Http.invites.getAllAsync);
app.put('/api/invites/:send', verify, Http.invites.putAsync);
app.get('/api/invites/preReg/:organization/:code', Http.invites.getEmailAsync);
app.get('/api/invites/postReg/:organization/:code', Http.invites.getAndAcceptAsync);
//app.get('/api/resources/Info', Http.metadata.setInfo, Http.metadata.getResourcesAsync);
app.get('/api/edge-data/clear', Http.misc.clearKvAsync);
//
//  Auth calls
//
app.get('/api/activity/:organization/:topLevelId', verify, Http.activity.getByIdAsync);
app.get('/api/activity/:organization/user/:userId', verify, Http.activity.getByUserIdAsync);
app.put('/api/activity/:organization/:dataType', verify, Http.activity.putAsync);
app.get('/api/projects/:organization/my', verify, Http.project.getAllAsync);
app.get('/api/projects/:organization/watched', verify, Http.project.getAllWatchedAsync);
app.get('/api/projects/:organization/byId/:projectId', verify, cache, Http.project.getByIdAsync);
app.put('/api/projects/:organization/byId/:projectId', verify, Http.project.putAsync);
app.get('/api/projects/:organization/byId/:projectId/nodes', verify, Http.projectNodes.getAsync);
app.put('/api/projects/:organization/byId/:projectId/nodes/batch', verify, Http.projectNodes.batchAsync);
app.put('/api/projects/:organization/byId/:projectId/nodes/:nodeId', verify, Http.projectNodes.putAsync);
app.get('/api/projects/:organization/byId/:projectId/users', verify, Http.projectNodes.getAsync);
app.get('/api/projects/:organization/snapshot/:projectId/:activityId', verify, Http.projectSnapshots.getByActivityIdAsync);
app.get('/api/discussions/:organization/:associationId', verify, Http.discussions.getAsync);
app.get('/api/discussions/:organization/:associationId/users', verify, Http.discussions.getUsersAsync);
app.get('/api/discussions/:organization/:associationId/:id', verify, Http.discussions.getAsync);
app.get('/api/discussions/:organization/:associationId/:id/text', verify, Http.discussions.getTextAsync);
//app.put('/api/discussions/:organization/:id', verify, Http.discussions.putAsync);
app.get('/api/users/:organization', verify, Http.users.getAllAsync);
app.get('/api/users/:organization/lite', verify, Http.users.getAllLiteAsync);
app.post('/api/user', verify, isAdmin, Http.users.updateUserAsync);
app.get('/api/files/:file', verify, Http.misc.getStaticFileAsync);

for (const path of AZURE_ROUTES_POST) {
  app.post('/' + path, verify, Http.misc.handleAzureCallAsync);
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
