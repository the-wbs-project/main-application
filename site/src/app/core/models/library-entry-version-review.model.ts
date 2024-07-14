export interface LibraryEntryVersionReview {
  id: string;
  author: string;
  timestamp: Date;
  anonymous: boolean;
  rating: number;
  comment?: string;
}
