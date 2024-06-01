export interface OpenAiMessage {
  content: string | null;
  role: string;
  name?: string;
}

export interface OpenAiRequest {
  model: string;
  messages: OpenAiMessage[];
  tempurature?: number;
  top_p?: number;
  n?: number;
  logprobs?: number;
  echo?: boolean;
  stop?: string;
  presence_penalty?: number;
  frequency_penalty?: number;
  max_tokens?: number;
  return_prompt?: boolean;
  return_metadata?: boolean;
  return_sequences?: boolean;
  response_format?: { type: 'json ' };
  expand?: boolean;
  logit_bias?: {
    [key: string]: number;
  };
  user?: string;
}
