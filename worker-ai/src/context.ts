import { Context as C } from 'hono';
import { AIService } from './services';

export type Context_Env = {
	AI: any;
	AI_GATEWAY: string;
	AI_REST_TOKEN: string;
	ALLOWED_USERS: string;
	AUTH_AUDIENCE: string;
	AUTH_DOMAIN: string;
	CORS_ORIGINS: string;
	KV: KVNamespace;
	OPEN_AI_KEY: string;
};

export type Context_Variables = {
	ai: AIService;
};

export type Context = C<{
	Bindings: Context_Env;
	Variables: Context_Variables;
}>;
