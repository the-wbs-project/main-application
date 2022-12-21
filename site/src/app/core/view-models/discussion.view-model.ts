export interface DiscussionViewModel {
  id: string;
  associationId: 'none' | string;
  title?: string;
  text: string;
  threadId?: string;
  replyToId?: string;
  writtenBy: string;
  timestamp: number;
  promotions: string[];
  demotions: string[];
  children: DiscussionViewModel[];
}
