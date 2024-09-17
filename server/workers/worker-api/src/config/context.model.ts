import { Context as C } from 'hono';
import { Env } from './env.model';
import { Variables } from './variables.model';

export type Context = C<{ Bindings: Env; Variables: Variables }>;
