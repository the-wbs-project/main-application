import * as hono from 'hono';
import { Env } from './env.model';
import { Variables } from './variables.model';

export type HonoEnv = { Bindings: Env; Variables: Variables };

export type Context = hono.Context<HonoEnv>;
