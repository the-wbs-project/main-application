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
  promotions: string[];
  demotions: string[];
}
