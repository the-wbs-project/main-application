export interface OnboardingRecord {
  inviteId: string;
  email: string;
  organizationId: string;
  organizationName: string;
  inviteStatus: string;
  userId?: string;
  roles: string[];
}
