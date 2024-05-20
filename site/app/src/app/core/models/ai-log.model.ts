export interface AiLog {
  timestamp: Date;
  user: string;
  model: string;
  input: string;
  success: boolean;
  output?: string;
  errors?: any;
  fullInput?: any;
  fullOutput?: any;
}
