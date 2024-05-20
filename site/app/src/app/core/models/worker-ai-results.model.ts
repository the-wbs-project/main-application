export interface WorkerAiResults {
  result: {
    response: string;
  };
  success: boolean;
  errors: any[];
  messages: any[];
}
