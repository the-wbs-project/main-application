export interface Message {
  text: string;
  timestamp: Date;
  author: MessageUser;
}

export interface MessageUser {
  id: string;
  name: string;
  avatarUrl?: string;
}
