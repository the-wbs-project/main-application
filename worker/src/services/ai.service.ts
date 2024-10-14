import { Env } from '../config';

export class AIService {
  constructor(private readonly env: Env) {}

  async runWorkerAiAsync(model: string, body: string): Promise<any> {
    const response = await fetch(
      `https://gateway.ai.cloudflare.com/v1/004dc1af737b22a8aa83b3550fa9b9d3/${this.env.AI_GATEWAY}/workers-ai/${model}`,
      {
        headers: { Authorization: 'Bearer ' + this.env.AI_REST_TOKEN, 'Content-Type': 'application/json' },
        method: 'POST',
        body,
      },
    );
    return await response.json();
  }

  async runOpenAiAsync(body: string): Promise<any> {
    const response = await fetch(
      `https://gateway.ai.cloudflare.com/v1/004dc1af737b22a8aa83b3550fa9b9d3/${this.env.AI_GATEWAY}/openai/chat/completions`,
      {
        headers: {
          Authorization: 'Bearer ' + this.env.AI_OPEN_AI_KEY,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body,
      },
    );
    return await response.json();
  }
}
