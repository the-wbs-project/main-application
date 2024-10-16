export interface OrganizationRole {
  organizationId: string;
  userId: string;
  role: string;
}

export type RoleRollup = Record<string, string[]>;
