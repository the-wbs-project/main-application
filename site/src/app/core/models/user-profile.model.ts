export interface User {
  user_id: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture?: string;
  phone_number?: string;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  logins_count?: number;
  user_metadata: {
    title?: string;
    linkedIn?: string;
    twitter?: string;
    showExternally: string[];
  };
}
