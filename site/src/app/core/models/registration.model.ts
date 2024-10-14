export interface Registration {
  inviteId: string;
  email: string;
  password: string;
  fullName: string;
  title?: string;
  twitter?: string;
  linkedIn?: string;
  showExternally: string[];
}
