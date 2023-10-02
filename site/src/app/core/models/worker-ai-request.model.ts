export interface WorkerAiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface WorkerAiRequest {
  messages: WorkerAiMessage[];
}
