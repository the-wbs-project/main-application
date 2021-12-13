export interface ThreadedDiscussion {
  comments: ThreadedComment[];
}

export interface ThreadedComment {
  id: string;
  author: string;
  timestamp: Date;
  text: string;
  replies?: ThreadedComment[];
}
