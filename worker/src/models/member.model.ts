export interface Member {
  id: string;
  email: string;
  name: string | null | undefined;
  roles: string[];
}
