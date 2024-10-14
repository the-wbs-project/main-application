export interface OnboardingRecord {
  inviteId: string;
  inviteStatus: 'Active' | 'Completed' | 'Cancelled';
  email: string;
  userId?: string;
  organizationId: string;
  organizationName: string;
}
