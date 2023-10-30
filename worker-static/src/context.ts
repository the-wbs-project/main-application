import { Context as C } from 'hono';

export type Context_Env = {
	AUTH_AUDIENCE: string;
	AUTH_DOMAIN: string;
	CORS_ORIGINS: string;
	BUCKET: R2Bucket;
};

export type Context_Variables = {};

export type Context = C<{
	Bindings: Context_Env;
	Variables: Context_Variables;
}>;
