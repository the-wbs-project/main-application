import { User } from "../user.model";

export interface AuthorizationModel {
  accessToken?: string;
  idToken?: string;
  user?: User;
  sessionId?: string;
}
