export class AIService {
	constructor(private readonly gateway: string, private readonly openAiKey: string, private readonly restApiKey: string) {}

	async runWorkerAiAsync(model: string, body: string): Promise<any> {
		const response = await fetch(
			`https://gateway.ai.cloudflare.com/v1/004dc1af737b22a8aa83b3550fa9b9d3/${this.gateway}/workers-ai/${model}`,
			{
				headers: { Authorization: 'Bearer ' + this.restApiKey, 'Content-Type': 'application/json' },
				method: 'POST',
				body,
			}
		);
		return await response.json();
	}

	async runOpenAiAsync(body: string): Promise<any> {
		const response = await fetch(
			`https://gateway.ai.cloudflare.com/v1/004dc1af737b22a8aa83b3550fa9b9d3/${this.gateway}/openai/chat/completions`,
			{
				headers: {
					Authorization: 'Bearer ' + this.openAiKey,
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body,
			}
		);
		return await response.json();
	}
}
