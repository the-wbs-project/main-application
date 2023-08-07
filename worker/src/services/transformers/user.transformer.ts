import { User, UserLite } from '../../models';

export class UserTransformer {
  static toModel(payload: Record<string, any>): User;
  static toModel(payload: Record<string, any>[]): User[];
  static toModel(payload: Record<string, any> | Record<string, any>[]): User | User[] {
    if (Array.isArray(payload)) return payload.map((m) => UserTransformer.toModel(m));

    return {
      blocked: payload.blocked ?? false,
      createdAt: payload.created_at,
      email: payload.email,
      emailVerified: payload.email_verified,
      name: payload.name,
      id: payload.user_id,
      lastLogin: payload.last_login,
      loginsCount: payload.logins_count,
      userInfo: payload.user_metadata || {},
    };
  }

  static toLiteModel(payload: Record<string, any>): UserLite;
  static toLiteModel(payload: Record<string, any>[]): UserLite[];
  static toLiteModel(payload: Record<string, any> | Record<string, any>[]): UserLite | UserLite[] {
    if (Array.isArray(payload)) return payload.map((m) => UserTransformer.toLiteModel(m));

    return {
      email: payload.email,
      name: payload.name,
      id: payload.user_id,
    };
  }
}
