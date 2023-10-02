import { OpenAiMessage } from './open-ai-request.model';

export interface OpenAiResults {
  id: string;
  choices: {
    /**
     * The reason the model stopped generating tokens. This will be
     *      `stop` if the model hit a natural stop point or a provided stop sequence,
     *      `length` if the maximum number of tokens specified in the request was reached,
     *      `content_filter` if content was omitted due to a flag from our content filters, or
     *      `function_call` åif the model called a function.
     */
    finish_reason: 'stop' | 'length' | 'function_call' | 'content_filter';

    index: number;
    message: OpenAiMessage;
  }[];

  created: number;
  model: string;
  object: string;
  usage?: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
  };
  error?: {
    message: string;
    type: string;
    param?: any;
    code?: any;
  };
}
