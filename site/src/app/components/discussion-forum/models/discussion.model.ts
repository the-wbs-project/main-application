export interface Discussion {
  id: string;
  associationId: 'none' | string;
  title?: string;
  text: string;
  threadId?: string;
  replyToId?: string;
  writtenBy: string;
  createdOn: number;
  lastUpdated: number;
  removed?: boolean;
  replies: number;
  promotions: string[];
  demotions: string[];
}
