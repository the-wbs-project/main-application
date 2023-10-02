export const TEXT_MODELS = [
	{
		model: 'gpt-3.5-turbo',
		type: 'open-ai',
		title: 'OpenAI ChatGPT 3.5 Turbo',
	},
	{
		model: 'gpt-4',
		type: 'open-ai',
		title: 'OpenAI ChatGPT 4',
	},
	{
		model: '@cf/meta/llama-2-7b-chat-int8',
		type: 'worker-ai',
		title: 'Meta Llama 2.7b',
	},
];

export type OPEN_AI_MODELS =
	| 'gpt-4'
	| 'gpt-4-0314'
	| 'gpt-4-0613'
	| 'gpt-4-32k'
	| 'gpt-4-32k-0314'
	| 'gpt-4-32k-0613'
	| 'gpt-3.5-turbo'
	| 'gpt-3.5-turbo-16k'
	| 'gpt-3.5-turbo-0301'
	| 'gpt-3.5-turbo-0613'
	| 'gpt-3.5-turbo-16k-0613';
