import { Hono } from 'hono';
import { HonoEnv } from './config';
import { cors, ddLogger, error, verifyAdmin, verifyJwt, verifyMembership } from './middle';
import { Auth0Service, DataDogService, DataServiceFactory, Fetcher, Http, HttpLogger } from './services';

const app = new Hono<HonoEnv>();
//
//  Dependency Injection
//
app.use('*', async (ctx, next) => {
  const datadog = new DataDogService(ctx.env);
  const logger = new HttpLogger(ctx);
  const fetcher = new Fetcher(logger);
  const auth0 = new Auth0Service(ctx.env, fetcher, logger);
  const data = new DataServiceFactory(auth0, ctx.env.KV_DATA, ctx.executionCtx);

  ctx.set('datadog', datadog);
  ctx.set('logger', logger);
  ctx.set('fetcher', fetcher);
  ctx.set('data', data);

  await next();
});
app.use('*', ddLogger);
app.use('*', cors);
app.onError(error);
app.options('api/*', (c) => c.text(''));

app.use('*', verifyJwt);
//
//  Orgs & Memberships
//
const orgs = Http.organizations;
const members = Http.memberships;

app.get('api/organization/:organization', orgs.getByNameAsync);
app.get('api/organization/:organization/members', verifyMembership, members.getAllAsync);

app.put('api/organization/:organization/members', verifyAdmin, members.addAsync);
app.put('api/organization/:organization/members/:user/roles', verifyAdmin, members.addToRolesAsync);

app.delete('api/organization/:organization/members', verifyAdmin, members.deleteAsync);
app.delete('api/organization/:organization/members/:user/roles', verifyAdmin, members.deleteFromRolesAsync);

//
//  Users
//
app.get('api/users/roles', Http.users.getSiteRolesAsync);
app.get('api/users/memberships', Http.users.getMembershipsAsync);
app.put('api/users', Http.users.updateAsync);

export const APP_ROUTES = app;
