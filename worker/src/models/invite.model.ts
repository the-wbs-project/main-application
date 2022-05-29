export interface Invite {
  id: string;
  type: string;
  email: string;
  culture: string;
  claims: string[];
  cancelled: boolean;
  accepted: boolean;
  dateSent: Date | null;
  dateAccepted: Date | null;
}
