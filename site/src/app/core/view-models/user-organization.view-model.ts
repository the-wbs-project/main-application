export interface UserOrganizationViewModel {
  userId: string;
  userName: string;
  userEmail: string;
  userTitle?: string;
  userPhoneNumber?: string;
  orgId: string;
  orgName: string;
  orgRoles: string[];
}
