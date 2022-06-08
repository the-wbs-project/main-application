export interface Invite {
  id: string;
  type: string;
  email: string;
  culture: string;
  roles: string[];
  cancelled: boolean;
  dateSent: Date | null;
  dateAccepted: Date | null;
}
