export interface OpenAiMessage {
  content: string | null;
  role: 'system' | 'user' | 'assistant';
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
  expand?: boolean;
  logit_bias?: {
    [key: string]: number;
  };
  user?: string;
}
export interface OpenAiMessage {
  /**
   * The contents of the message.
   */
  content: string | null;

  /**
   * The role of the author of this message.
   */
  role: 'system' | 'user' | 'assistant';
}
