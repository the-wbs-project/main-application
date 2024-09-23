import { Context as C } from 'hono';
import { Env } from './env.model';
import { Variables } from './variables.model';
//
//  This is so we can pass a context which doesn't include request info.
//
export type ContextLocal = { env: Env; var: Variables; executionCtx: ExecutionContext };

export type Context = C<{ Bindings: Env; Variables: Variables }>;
