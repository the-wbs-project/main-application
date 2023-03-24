export interface Discussion {
  id: string;
  associationId: 'none' | string;
  title?: string;
  text: string;
  threadId?: string;
  replyToId?: string;
  writtenBy: string;
  timestamp: number;
  removed?: boolean;
  promotions: string[];
  demotions: string[];
}
